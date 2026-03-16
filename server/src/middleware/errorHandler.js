

import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import { env } from '../config/env.js';

// ─── Error Converter ──────────────────────────────────────────────────
// Converts known error types into ApiError instances

const convertToApiError = (err) => {
  // Already an ApiError — pass through
  if (err instanceof ApiError) return err;

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return ApiError.badRequest('Validation failed', errors);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiError.conflict(
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    );
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return ApiError.unauthorized('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Token expired');
  }

  // Unknown error — treat as 500
  return ApiError.internal(err.message || 'Something went wrong');
};


// ─── Global Error Handler ─────────────────────────────────────────────
// MUST have 4 parameters for Express to treat it as error handler

const errorHandler = (err, req, res, next) => {
  const apiError = convertToApiError(err);

  // Log the error
  if (apiError.statusCode >= 500) {
    console.error('🔴 Server Error:', {
      message: apiError.message,
      stack: apiError.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // Build response object
  const response = {
    status: apiError.status,
    message: apiError.message,
  };

  // Include validation errors if present
  if (apiError.errors.length > 0) {
    response.errors = apiError.errors;
  }

  // Include stack trace in development ONLY
  if (env.isDev) {
    response.stack = apiError.stack;
  }

  res.status(apiError.statusCode).json(response);
};


// ─── Unhandled Promise Rejection Handler ─────────────────────────────

const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('🔴 Unhandled Rejection:', reason);
    // Gracefully shut down
    process.exit(1);
  });

  process.on('uncaughtException', (error) => {
    console.error('🔴 Uncaught Exception:', error);
    process.exit(1);
  });
};

export { errorHandler, handleUnhandledRejection };
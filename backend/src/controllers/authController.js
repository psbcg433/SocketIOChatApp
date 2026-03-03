import User from '../models/User.js';
import createError from 'http-errors';

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    const result = await User.registerUser(username, email, password);
    
    if (!result.success) {
      return next(createError(400, result.error));
    }

    res.status(201).json({
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const result = await User.loginUser(email, password);
    
    if (!result.success) {
      return next(createError(401, result.error));
    }

    res.json({
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (err) {
    next(err);
  }
};
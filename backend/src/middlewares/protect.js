import createError from 'http-errors';
import { verifyAccessToken } from '../utils/tokenHelper.js';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next(createError(401, 'Not authorized'));

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) return next(createError(401, 'Invalid token'));

  req.user = { id: decoded.id };
  next();
};

export default protect;
import createError from 'http-errors';
import { verifyAccessToken } from '../../utils/tokenHelper.js';

export const authenticateSocket = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(createError(401, 'Missing token'));
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return next(createError(401, 'Invalid token'));
    }

    socket.userId = decoded.id.toString();
    next(); 
  } catch (err) {
    next(createError(500, 'Auth server error', { cause: err }));
  }
};
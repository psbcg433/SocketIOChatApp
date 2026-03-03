import jwt from 'jsonwebtoken';
import createError from 'http-errors';

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(createError(401, 'Not authorized'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    next(createError(401, 'Invalid token'));
  }
};

export default protect;
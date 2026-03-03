import createError from 'http-errors';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';   

class AuthController {
  static register = asyncHandler(async (req, res) => {  
    const { username, email, password } = req.body;
    const result = await User.registerUser(username, email, password);

    if (!result.success) {
      throw createError(400, result.error);
    }

    res.status(201).json(result);
  });

  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await User.loginUser(email, password);

    if (!result.success) {
      throw createError(401, result.error);
    }

    res.json(result);
  });

  static refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await User.refreshAccessToken(refreshToken);

    if (!result.success) {
      throw createError(401, result.error);
    }

    res.json(result);
  });

  static logout = asyncHandler(async (req, res) => {
    await User.logoutUser(req.user.id);
    res.json({ success: true, message: 'Logged out' });
  });
}

export default AuthController;
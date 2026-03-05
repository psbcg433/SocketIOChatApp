import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/tokenHelper.js';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);


userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};



userSchema.statics.registerUser = async function (username, email, password) {
  if (!username || !email || !password) {
    return { success: false, error: 'All fields required' };
  }

  const exists = await this.findOne({ email });
  if (exists) {
    return { success: false, error: 'User already exists' };
  }

  const user = await this.create({ username, email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Use update instead of save to avoid triggering middleware again
  await this.findByIdAndUpdate(user._id, { refreshToken });

  return {
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  };
};

userSchema.statics.loginUser = async function (email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password required' };
  }

  const user = await this.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return { success: false, error: 'Invalid credentials' };
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Again: update directly instead of save()
  await this.findByIdAndUpdate(user._id, { refreshToken });

  return {
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  };
};

userSchema.statics.refreshAccessToken = async function (refreshToken) {
  if (!refreshToken) {
    return { success: false, error: 'No refresh token' };
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return { success: false, error: 'Invalid refresh token' };
  }

  const user = await this.findOne({
    _id: decoded.id,
    refreshToken
  });

  if (!user) {
    return { success: false, error: 'Refresh token revoked' };
  }

  const newAccessToken = generateAccessToken(user._id);

  return {
    success: true,
    accessToken: newAccessToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  };
};

userSchema.statics.logoutUser = async function (userId) {
  await this.findByIdAndUpdate(userId, { refreshToken: null });
  return { success: true };
};

export default mongoose.model('User', userSchema);
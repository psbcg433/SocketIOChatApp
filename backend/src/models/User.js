import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/tokenHelper.js';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Static method for user registration
userSchema.statics.registerUser = async function (username, email, password) {
  try {
    if (!username || !email || !password) {
      return { success: false, error: 'All fields required' };
    }

    const userExists = await this.findOne({ email });
    if (userExists) {
      return { success: false, error: 'User already exists' };
    }

    const user = await this.create({ username, email, password });
    const token = generateToken(user._id);

    return {
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email }
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Static method for user login
userSchema.statics.loginUser = async function (email, password) {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email and password required' };
    }

    const user = await this.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return { success: false, error: 'Invalid credentials' };
    }

    const token = generateToken(user._id);

    return {
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email }
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export default mongoose.model('User', userSchema);
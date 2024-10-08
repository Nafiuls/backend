import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateVerificationCode } from '../utils/generateVerificationCode.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import {
  sendResetPasswordEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '../mailtrap/emails.js';

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    // checking fields
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }
    // checking if user exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(500).json({ message: 'user already exists' });
    }
    //  hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationCode();
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await user.save();
    // jwt token
    await generateTokenAndSetCookie(res, user._id);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        ...user._doc,
        password: null,
      },
    });

    // send verification email

    await sendVerificationEmail(user.email, verificationToken);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// verify email controller

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne(
      { verificationToken: code }
      // { verificationTokenExpiresAt: { $gt: Date.now() } } --->> THERE IS A ERROR FIX THIS LATER
    );
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid or Expired verification code' });
    }
    user.isVerified = true;
    (user.verificationToken = undefined),
      (user.verificationTokenExpiresAt = undefined);
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// login controller

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    await generateTokenAndSetCookie(res, user._id);
    User.lastLogin = new Date();
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log('error logging function', error);
    res.status(500).json({ sucess: false, message: error.message });
  }
};

// logout controller

export const logout = async (req, res) => {
  await res.clearCookie('token');
  res.status(200).json({ sucess: true, message: 'Logged out successfully' });
};

// forgot password

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid Creadentials' });
    }
    // generate forget password token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();
    // send email
    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res
      .status(200)
      .json({ success: true, message: 'Reset password link sent' });
  } catch (error) {
    console.log('error in forgot password', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// reset password

export const resetPassword = async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      // resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Token expired or invalid' });
    }
    // update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendResetSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.log('error in reset password', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// check auth
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log('error in check auth', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import config from 'config';

import {
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  ResetPasswordParams,
  SignupInput,
  verifyEmailInput,
  verifyEmailParams,
} from '../schema/user.schema.js';
import {
  createNewUser,
  findUserByEmail,
  findUserById,
  findUserByResetCode,
  setNewPassword,
  updateLastLogin,
  updatePasswordResetCode,
  verifyUser,
} from '../services/user.service.js';
import { ExpressError } from '../utils/ExpressError.js';
import { hashPassword, verifyPassword } from '../utils/passwordUtility.js';
import { addTimestamps } from '../utils/db/addTimeStamps.js';
import { User } from '../models/user.model.js';
import { logger } from '../utils/logger.js';
import { generateTokenAndSetCookie } from '../utils/jwt.js';
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '../mailtrap/emails.js';

export const signupHandler = async (
  req: Request<{}, {}, SignupInput>,
  res: Response
) => {
  const {
    email,
    password,
    name,
    isVerified,
    lastLogin,
    verificationCode,
    verificationCodeExpiresAt,
    resetPasswordCode,
    resetPasswordCodeExpiresAt,
  } = req.body;

  const userExists = await findUserByEmail(email);
  if (userExists) {
    throw new ExpressError('Invalid Email or Password', 409);
  }

  const hashedPassword = await hashPassword(password);
  const numVerificationCode = parseInt(verificationCode);
  const newUser: User = addTimestamps({
    email,
    password: hashedPassword,
    name,
    isVerified,
    lastLogin,
    verificationCode: numVerificationCode,
    verificationCodeExpiresAt,
    resetPasswordCode,
    resetPasswordCodeExpiresAt,
  });

  const result = await createNewUser(newUser);
  if (!result?.acknowledged) {
    logger.error('Failed to create new User');
    throw new ExpressError('Registration failed', 500);
  }

  const token = generateTokenAndSetCookie(res, result.insertedId.toString());
  res.status(201).json({
    success: true,
    message: 'User Created Successfully',
    userId: result.insertedId.toString(),
  });

  // Send verification email
  await sendVerificationEmail(email, verificationCode);
};

export const loginHandler = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    res.status(400).json({ success: false, message: 'Invalid Credentials' });
    return;
  }

  if (!user.isVerified) {
    res
      .status(401)
      .json({ success: false, message: 'Please verify your email' });
    return;
  }

  const isValid = await verifyPassword(user.password, password);
  if (!isValid) {
    res.status(401).json({ success: false, message: 'Invalid Credentials' });
    return;
  }
  generateTokenAndSetCookie(res, user._id.toString());
  const result = await updateLastLogin(user._id);
  if (
    result?.acknowledged &&
    result.matchedCount > 0 &&
    result.modifiedCount > 0
  ) {
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
    });
    return;
  }
  res.status(500).json({ success: false, message: 'Login failed' });
};

export const logoutHandler = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const { code } = req.body;
  const id = req.params.id;

  const user = await findUserById(id);
  if (!user) {
    throw new ExpressError('Failed to verify user', 500);
  }

  if (user.isVerified) {
    res.status(200).json({ message: 'User is already verified' });
    return;
  }

  //check if verification code matches
  if (user.verificationCode === parseInt(code)) {
    const result = await verifyUser(user._id);
    if (
      result?.acknowledged &&
      result.matchedCount > 0 &&
      result.modifiedCount > 0
    ) {
      await sendWelcomeEmail(user.email, user.name);
      res
        .status(200)
        .json({ success: true, message: 'Verification Successful' });
      return;
    }
    res.status(403).json({ message: 'Failed to verify user' });
    return;
  }
  res.status(403).json({ message: 'Verification Failed' });
};

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) => {
  const { email } = req.body;
  const jsonResponsePayload = {
    message:
      'If a user with that email is registered you will receive a password reset email',
  };
  const user = await findUserByEmail(email);

  if (!user) {
    res.status(200).json(jsonResponsePayload);
    return;
  }

  if (!user.isVerified) {
    res.status(200).json({ success: false, message: 'User is not verified' });
  }

  const passwordResetCode = nanoid();
  const passwordResetCodeExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1hr
  const result = await updatePasswordResetCode(
    user._id,
    passwordResetCode,
    passwordResetCodeExpiresAt
  );

  if (
    result?.acknowledged &&
    result.matchedCount > 0 &&
    result.modifiedCount > 0
  ) {
    const clientUrl = config.get<string>('client_url');
    await sendPasswordResetEmail(
      email,
      `${clientUrl}reset-password/${passwordResetCode}`
    );
    res
      .status(200)
      .json({
        success: true,
        message: 'Password reset link sent to your email',
      });
    return;
  }

  res.status(500).json({ success: false, message: 'Password reset Failed' });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { resetCode } = req.params;
  const { password } = req.body;

  const user = await findUserByResetCode(resetCode);
  if(!user) {
    res.status(400).json({success: false, message: 'Invalid or expired reset token'});
    return;
  };

  const hashedPassword = await hashPassword(password);

  const result = await setNewPassword(user._id, hashedPassword);
  if (
    result?.acknowledged &&
    result.matchedCount > 0 &&
    result.modifiedCount > 0
  ) {
    await sendResetSuccessEmail(user.email);
    res.status(200).json({success: true, message: 'Password reset successful'});
    return;
  }
  res.status(500).json({success: false, message: 'Failed to reset password'});
};

export const checkAuth = async (req: Request, res: Response) => {
  if(!req.userId) {
    throw new ExpressError('Missing user id', 500)
  }
  const user = await findUserById(req.userId);
  if(!user) {
    res.status(400).json({success: true, message: 'User not found'});
    return;
  }
  res.status(200).json({success: true, user: {_id: user._id, name: user.name}})
};

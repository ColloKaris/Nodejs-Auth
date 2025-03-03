import { Request, Response } from 'express';
import {
  LoginInput,
  SignupInput,
  verifyEmailInput,
  verifyEmailParams,
} from '../schema/user.schema.js';
import {
  createNewUser,
  findUserByEmail,
  findUserById,
  updateLastLogin,
  verifyUser,
} from '../services/user.service.js';
import { ExpressError } from '../utils/ExpressError.js';
import { hashPassword, verifyPassword } from '../utils/passwordUtility.js';
import { addTimestamps } from '../utils/db/addTimeStamps.js';
import { User } from '../models/user.model.js';
import { logger } from '../utils/logger.js';
import { generateTokenAndSetCookie } from '../utils/jwt.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/emails.js';

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
  }
  res.status(403).json({ message: 'Verification Failed' });
};

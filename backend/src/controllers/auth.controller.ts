import { Request, Response } from 'express';
import { SignupInput } from '../schema/user.schema.js';
import { createNewUser, findUserByEmail } from '../services/user.service.js';
import { ExpressError } from '../utils/ExpressError.js';
import { hashPassword } from '../utils/passwordUtility.js';
import { addTimestamps } from '../utils/db/addTimeStamps.js';
import { User } from '../models/user.model.js';
import { logger } from '../utils/logger.js';
import { generateTokenAndSetCookie } from '../utils/jwt.js';

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
  const newUser: User = addTimestamps({
    email,
    password: hashedPassword,
    name,
    isVerified,
    lastLogin,
    verificationCode,
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
  res
    .status(201)
    .json({
      success: true,
      message: 'User Created Successfully',
      userId: result.insertedId.toString(),
    });
};

export const loginHandler = async (req: Request, res: Response) => {};

export const logoutHandler = async (req: Request, res: Response) => {};

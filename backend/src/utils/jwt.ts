// Create a json web toeken
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';

const secret = config.get<string>('JWT_SECRET');
export const generateTokenAndSetCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, secret, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    //secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};

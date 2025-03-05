import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from 'config';
import { logger } from '../utils/logger.js';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    res
      .status(401)
      .json({ success: false, message: 'Unauthorized Access - No token' });
    return;
  }
  try {
    const secret = config.get<string>('JWT_SECRET');
    const decoded = jwt.verify(token, secret) as JwtPayload; // tells TypeScript that decoded is of type JwtPayload, so it can safely access .userId.

    if (decoded && typeof decoded !== 'string') {
      // jwt library sometimes returns a string if the token is impropertly signed
      req.userId = decoded.userId; 
      next(); 
    } else {
      res
        .status(401)
        .json({
          success: false,
          message: 'Unauthorized Access - Invalid token',
        });
      return;
    }
  } catch (error) {
    logger.error('Error in verify token', error);
    res.status(500).json({success: false, message: 'Server Error'});
    return;
  }
};

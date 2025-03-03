import argon2 from 'argon2';
import { ExpressError } from './ExpressError.js';
import { logger } from './logger.js';

// argon2id is more resistant to side-channel and GPU attacks than argon2i or
// argon2d
const options = {
  type: argon2.argon2id, // recommended for password hashing
  memoryCost: 2 ** 16, //64MB controls how much RAM the algorithm uses while hashing. Makes it harder to brute force
  timeCost: 3, // iterations - the number of times the algorithm runs on the input
  parallelism: 1 // controls the number of CPU threads used while hashing
}

export async function hashPassword(password: string) {
  try {
    const hash = await argon2.hash(password, options);
    return hash;
  } catch (error) {
    logger.error('Password hashing failed: ', error);
    throw new ExpressError('Registration Failed', 500);
  }
}

export async function verifyPassword(hash: string, candidatePassword: string) {
  try {
    const isMatch = await argon2.verify(hash, candidatePassword);
    return isMatch;
  } catch (error) {
    logger.error('Error verifying password: ', error);
    throw new ExpressError('Invalid Credentials', 401);
  }
}

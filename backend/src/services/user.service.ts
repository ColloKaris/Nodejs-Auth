import * as mongodb from 'mongodb';
import { User } from '../models/user.model.js';
import { collections } from '../utils/db/connectToDatabase.js';

export async function findUserByEmail(email: string) {
  const result = await collections.users?.findOne({ email: email });
  return result;
}

export async function createNewUser(user: User) {
  const result = await collections.users?.insertOne(user);
  return result;
}

export async function findUserById(id: string) {
  const result = await collections.users?.findOne({
    _id: new mongodb.ObjectId(id),
  });
  return result;
}

export async function verifyUser(id: mongodb.ObjectId) {
  const now = new Date();
  const result = await collections.users?.updateOne(
    { _id: id },
    {
      $set: {
        isVerified: true,
        updatedAt: now,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
    }
  );
  return result;
}

export async function updateLastLogin(id: mongodb.ObjectId) {
  const now = new Date();
  const result = await collections.users?.updateOne(
    { _id: id },
    { $set: { lastLogin: now } }
  );
  return result;
}

export async function updatePasswordResetCode(
  id: mongodb.ObjectId,
  resetCode: string | null,
  resetCodeExpiry: Date
) {
  const now = new Date();
  const result = await collections.users?.updateOne(
    { _id: id },
    {
      $set: {
        resetPasswordCode: resetCode,
        resetPasswordCodeExpiresAt: resetCodeExpiry,
        updatedAt: now,
      },
    }
  );
  return result;
}

export async function setNewPassword(
  userId: mongodb.ObjectId,
  password: string
) {
  const result = await collections.users?.updateOne(
    { _id: userId },
    {
      $set: {
        password: password,
        resetPasswordCode: null,
        resetPasswordCodeExpiresAt: null,
        updatedAt: new Date(Date.now()),
      },
    }
  );
  return result;
}

export async function findUserByResetCode(resetCode: string) {
  const result = collections.users?.findOne({
    resetPasswordCode: resetCode,
    resetPasswordCodeExpiresAt: { $gt: new Date(Date.now()) },
  });
  return result;
}

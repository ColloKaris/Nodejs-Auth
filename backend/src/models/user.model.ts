import * as mongodb from 'mongodb';

export interface User {
  _id?: mongodb.ObjectId;
  email: string;
  password: string;
  name: string;
  lastLogin: Date;
  isVerified: boolean;
  resetPasswordCode: string | null;
  resetPasswordCodeExpiresAt: Date | null;
  verificationCode: String;
  verificationCodeExpiresAt: Date;
  createdAt?: Date;
  updatedAt: Date;
};

export const userSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['email', 'password', 'name', 'lastLogin', 'isVerified'],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'Unique identifier for the session'
      },
      email: {
        bsonType: 'string',
        description: 'The user email',
      },
      password: {
        bsonType: 'string',
        description: 'Hashed password',
      },
      name: {
        bsonType: 'string',
        description: 'Name for the user',
      },
      lastLogin: {
        bsonType: 'date',
        description: 'Date the user last logged in',
      },
      isVerified: {
        bsonType: 'bool',
        description: 'Check if user is verified',
      },
      resetPasswordCode: {
        bsonType: ['string', 'null'],
        description: 'JWT token used to reset user password',
      },
      resetPasswordCodeExpiresAt: {
        bsonType: ['date', 'null'],
        description: 'Expiration date for the reset password token',
      },
      verificationCode: {
        bsonType: 'string',
        description: 'JWT token used to verify user',
      },
      verificationCodeExpiresAt: {
        bsonType: 'date',
        description: 'Expiry date for the verification token',
      },
      createdAt: {
        bsonType: 'date',
        description: 'Date the user was created',
      },
      updatedAt: {
        bsonType: 'date',
        description: 'Date when an update was made',
      },
    },
  }
}
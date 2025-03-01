import * as mongodb from 'mongodb';

export interface User {
  _id?: mongodb.ObjectId;
  email: string;
  password: string;
  name: string;
  lastLogin: Date;
  isVerified: boolean;
  resetPasswordToken: string;
  resetPasswordExpiresAt: Date;
  verificationToken: String;
  verificatinTokenExpiresAt: Date;
  createdAt?: Date;
  updateAt: Date;
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
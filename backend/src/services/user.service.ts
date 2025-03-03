import { User } from '../models/user.model.js';
import { collections } from '../utils/db/connectToDatabase.js';

export async function findUserByEmail(email: string) {
  const result = await collections.users?.findOne({email: email});
  return result;
};

export async function createNewUser(user: User) {
  const result = await collections.users?.insertOne(user);
  return result;
}
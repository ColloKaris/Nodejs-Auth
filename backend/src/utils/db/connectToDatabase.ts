import * as mongodb from 'mongodb';
import { User } from '../../models/user.model.js';
import { applySchemaValidation } from './applySchemaValidation.js';

// Hold references to collections
export const collections: { users?: mongodb.Collection<User> } = {};

export async function connectToDatabase(dbUri: string) {
  const client = new mongodb.MongoClient(dbUri);
  await client.connect();

  const db = client.db('NodeAuthAPI');
  await applySchemaValidation(db);

  collections.users = db.collection<User>('users');
}

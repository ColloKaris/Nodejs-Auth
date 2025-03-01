import * as mongodb from 'mongodb';
import { userSchema } from '../../models/user.model.js';

export async function applySchemaValidation(db: mongodb.Db) {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map((col) => col.name);

  await db
    .command({ collMod: 'users', validator: userSchema })
    .catch(async (error: mongodb.MongoServerError) => {
      // Check error code and collection existence
      if (error.code === 26 && !collectionNames.includes('users')) {
        await db.createCollection('users', { validator: userSchema });
      }
    });
}

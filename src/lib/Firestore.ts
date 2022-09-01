import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import * as path from 'path';
import './EnvConfig';

if (process.env.NODE_ENV !== 'development') {
  const configs = fs
    .readdirSync('./firebase-service-acc/')
    .filter((file) => file.endsWith('.json'));

  console.log(configs);
  configs.sort();

  configs.filter((config) => {
    const configPath = path.resolve(process.cwd(), __dirname, 'firebase-service-acc', config);
    const configContents = JSON.parse(fs.readFileSync(configPath).toString());
    // console.log(configContents);
    if (configContents.type === 'service_account') {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = configPath;
      return true;
    }
    return false;
  });

  initializeApp({
    credential: applicationDefault(),
  });
} else {
  initializeApp();
}
const db = getFirestore();

export default db;

async function deleteQueryBatch(query: FirebaseFirestore.Query, resolve: Function) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}

export async function deleteCollection(collectionPath: string, batchSize: number = 10) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
}

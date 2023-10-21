import fs from 'fs';
import * as path from 'path';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import './EnvConfig';

const basePath = path.resolve(process.cwd(), 'firebase-service-acc');
if (process.env.NODE_ENV !== 'development') {
  process.env.FIRESTORE_EMULATOR_HOST = '';
  const configs = fs.readdirSync(basePath).filter((file) => file.endsWith('.json'));

  console.debug(configs);
  configs.sort();

  const validConfigs = configs.filter((config) => {
    const configPath = path.resolve(basePath, config);
    // console.log(configPath);
    const configContents = JSON.parse(fs.readFileSync(configPath).toString());
    // console.log(configContents);

    if (configContents.type === 'service_account') {
      return true;
    }
    return false;
  });
  const certPath = path.resolve(basePath, validConfigs[0]);
  // console.log(certPath);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = certPath;
}

const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!fs.existsSync(filePath!)) {
  console.log("Can't find firebase service account file.");
  process.exit(1);
}

initializeApp();
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

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

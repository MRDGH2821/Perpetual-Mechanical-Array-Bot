import fs from 'fs';
import * as path from 'path';
import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
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

const credFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

function certCred() {
  if (
    !process.env.FIREBASE_CLIENT_EMAIL
    || !process.env.FIREBASE_PRIVATE_KEY
    || !process.env.FIREBASE_PROJECT_ID
  ) {
    return undefined;
  }

  return cert({
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

if (!fs.existsSync(credFilePath!) && !certCred()) {
  throw new Error("Can't find firebase service account credentials.");
}

initializeApp({
  credential: fs.existsSync(credFilePath!) ? applicationDefault() : certCred(),
});
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

export default db;
export const cred = {
  cert: certCred(),
  path: credFilePath,
};

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

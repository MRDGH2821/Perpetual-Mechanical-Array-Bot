import fs from 'fs';
import * as path from 'path';
import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { pmaLogger as logger } from '../pma-logger';
import './EnvConfig';
import { decodeBase64 } from './Firestore-Crypt';

const baseDir = path.resolve(process.cwd(), 'firebase-service-acc');
function searchCredFilePath(dir = baseDir): string | undefined {
  const files = fs.readdirSync(dir);
  const credFile = files.find((file) => file.endsWith('.json'));
  if (credFile) {
    try {
      const credPath = path.resolve(dir, credFile);
      cert(credPath);
      logger.info('Using firebase service account credentials from:', credPath);
      return credPath;
    } catch (e) {
      logger.error(e);
      logger.warn('Invalid firebase service account credentials file:', credFile);
      return undefined;
    }
  } else {
    logger.warn('No firebase service account credentials file found in:', dir);
  }
  return undefined;
}
if (process.env.NODE_ENV === 'development') {
  logger.info('Searching for Firebase credentials file in:', baseDir);
  searchCredFilePath();
} else {
  process.env.FIRESTORE_EMULATOR_HOST = '';
  process.env.GOOGLE_APPLICATION_CREDENTIALS = searchCredFilePath();
}

const credFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

function searchCredEnv() {
  if (
    !process.env.FIREBASE_CLIENT_EMAIL
    || !process.env.FIREBASE_PRIVATE_KEY
    || !process.env.FIREBASE_PROJECT_ID
  ) {
    logger.warn('Firebase credentials not found in 3 environment variables.');
    return undefined;
  }
  logger.info('Using firebase service account credentials from 3 environment variables.');
  return cert({
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

function searchBase64CredEnv() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    logger.warn('Firebase credentials not found in base64 environment variable.');
    return undefined;
  }
  logger.info('Using firebase service account credentials from base64 environment variable.');
  const decoded = decodeBase64(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64);
  const cred = JSON.parse(decoded);
  return cert(cred);
}

const finalCred = searchBase64CredEnv() || searchCredEnv() || applicationDefault();

if (!finalCred) {
  throw new Error("Can't find firebase service account credentials.");
}

initializeApp({
  credential: finalCred,
});
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

export default db;
export const cred = {
  cert: finalCred,
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

import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import { resolve } from 'path';

const configs = fs
  .readdirSync('./src/lib/firebase-service-acc/')
  .filter((file) => file.endsWith('.json'));

console.log(configs);
configs.sort();

configs.filter((config) => {
  const configPath = resolve(process.cwd(), __dirname, 'firebase-service-acc', config);
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
const db = getFirestore();

export default db;

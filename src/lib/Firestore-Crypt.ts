import { Buffer } from 'buffer';

export function encodeBase64(obj: any): any {
  const jsonString = JSON.stringify(obj);
  return Buffer.from(jsonString).toString('base64');
}

export function decodeBase64(base64String: string) {
  return Buffer.from(base64String, 'base64').toString();
}

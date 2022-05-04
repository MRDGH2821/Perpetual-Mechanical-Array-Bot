import fs from 'fs';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

/**
 * imports esm modules of given folder and returns an array of default imports
 * @function esmImporter
 * @param {import('fs').PathLike} folderPath - folder path
 * @returns {Promise<Array<object>>} - array of esm default imports
 */
export default async function esmImporter(folderPath: fs.PathLike) {
  const filePromises: any = [];
  const folder = resolve(folderPath as string);
  const files = fs.readdirSync(folder);

  files.forEach((file) => {
    const filePromise = new Promise((res, rej) => {
      import(pathToFileURL(resolve(folder, file)) as unknown as string)
        .then((imported) => res(imported.default))
        .catch((err) => {
          const error = new Error(`Cannot import given file: ${file}\nError: ${err}`);
          console.error(err);
          rej(error);
        });
    });
    filePromises.push(filePromise);
  });

  return Promise.all(filePromises);
}

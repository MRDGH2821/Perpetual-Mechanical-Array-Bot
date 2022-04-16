import fs from 'fs/promises';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

/**
 * imports esm modules of given folder and returns an array of default imports
 * @function esmImporter
 * @param {import('fs').PathLike} folderPath - folder path
 * @returns {Promise<Array<object>>} - array of esm default imports
 */
export default async function esmImporter(folderPath) {
  const filePromises = [];
  const folder = resolve(folderPath);
  const files = await fs.readdir(folder);

  files.forEach((file) => {
    const filePromise = new Promise((res, rej) => {
      import(pathToFileURL(resolve(folder, file)))
        .then((imported) => res(imported.default))
        .catch((err) => {
          const error = new Error(
            `Cannot import given file\n${file}\nError: ${err}`,
          );
          rej(error);
        });
    });
    filePromises.push(filePromise);
  });

  return Promise.all(filePromises);
}

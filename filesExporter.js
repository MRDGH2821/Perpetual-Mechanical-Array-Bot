import fs from 'fs/promises';
import { pathToFileURL } from 'url';
import { resolve } from 'path';

/**
 * returns array of file imports in given folder path
 * @function arrayOfFilesGenerator
 * @param {string} folderPath - folder path
 * @returns {Array[object]} - array of file imports in given folder
 */
export async function arrayOfFilesGenerator(folderPath) {
  const arrayOfFiles = [],
    folder = resolve(folderPath),
    // eslint-disable-next-line sort-vars
    files = await fs.readdir(folder);
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    const cmd = (await import(pathToFileURL(resolve(folder, file)))).default;
    arrayOfFiles.push(cmd);
  }
  return arrayOfFiles;
}

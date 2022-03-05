import fs from 'fs';
import { pathToFileURL } from 'url';
import { resolve } from 'path';

/**
 * returns array of file imports in given folder path
 * @function arrayOfFilesGenerator
 * @param {string} folderPath - folder path
 * @returns {Array[object]} - array of file imports in given folder
 */
export function arrayOfFilesGenerator(folderPath) {
  const arrayOfFiles = [],
    folder = resolve(folderPath);
  return fs.readdir(folder, (err, files) => {
    files.forEach(async(file) => {
      const jsfile = await import(pathToFileURL(`${folder}\\${file}`));
      // console.log(jsfile);
      arrayOfFiles.push(jsfile);
    });
    // console.log(arrayOfFiles);
    return arrayOfFiles;
  });
}

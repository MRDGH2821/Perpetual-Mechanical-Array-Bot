import fs from 'fs';
import { resolve } from 'path';

/**
 * returns array of file paths in given folder path
 * @function arrayOfFilesGenerator
 * @param {string} folderPath - folder path
 * @returns {Array[string]} - array of file paths in given folder
 */
export function arrayOfFilesGenerator(folderPath) {
  const arrayOfFiles = [],
    folder = resolve(folderPath);
  return fs.readdir(folder, (err, files) => {
    files.forEach((file) => {
      // console.log(file);
      const jsfile = `${folder}\\${file}`;
      arrayOfFiles.push(jsfile);
    });
    // console.log(arrayOfFiles);
    return arrayOfFiles;
  });
}

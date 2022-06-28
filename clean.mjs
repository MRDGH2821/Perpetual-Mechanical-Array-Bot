import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from 'fs';

function deleteFolderRecursive(path) {
  if (existsSync(path) && lstatSync(path).isDirectory()) {
    readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;

      if (lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        unlinkSync(curPath);
      }
    });

    console.log(`Deleting directory "${path}"...`);
    rmdirSync(path);
  }
}

const myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

if (myArgs[0]) {
  console.log('Cleaning working tree...');
  deleteFolderRecursive(myArgs[0]);
  console.log('Successfully cleaned working tree!');
} else {
  throw new Error('Provide path to folder to be deleted as argument');
}

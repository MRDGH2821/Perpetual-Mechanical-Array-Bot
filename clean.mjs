import * as fs from 'fs';

function deleteFolderRecursive(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;

      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });

    console.log(`Deleting directory "${path}"...`);
    fs.rmdirSync(path);
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

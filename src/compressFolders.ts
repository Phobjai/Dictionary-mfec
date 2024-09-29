import * as fs from 'fs';
import * as path from 'path';
import { getFolderSize } from './reportSize';
const archiver = require('archiver');



// Function to zip a directory and return the size of the zip file
const zipDirectory = (sourceDir: string, outPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const zipSize = fs.statSync(outPath).size; // Get the size of the zip file after compression
      resolve(zipSize);
    });

    archive.on('error', (err: Error) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
};

// Function to compress folders and compare file sizes before and after zipping
export const compressFolders = async () => {
  const outputDir = path.join(__dirname, '..', 'output');
  const zipDir = path.join(__dirname, '..', 'zip'); // Folder to store the zip files

  // Create the "zip" folder if it doesn't exist
  if (!fs.existsSync(zipDir)) {
    fs.mkdirSync(zipDir);
  }

  const folders = fs.readdirSync(outputDir);

  for (const folder of folders) {
    const folderPath = path.join(outputDir, folder);
    const zipPath = path.join(zipDir, `${folder}.zip`); // Store zip files inside "zip" folder

    // Get the size of the folder before compression
    const folderSizeBefore = getFolderSize(folderPath);
    const folderSizeKB = (folderSizeBefore / 1000).toFixed(2); // Size in KB

    console.log(`${folder} - Size before compression: ${folderSizeKB} KB`);

    // Zip the folder and get the size of the zip file after compression
    try {
      const zipSize = await zipDirectory(folderPath, zipPath);
      const zipSizeKB = (zipSize / 1000).toFixed(2); // Size in KB

      console.log(`${folder} - Size after compression: ${zipSizeKB} KB`);
      console.log(`${folder} - Compression ratio: ${(zipSize / folderSizeBefore * 100).toFixed(2)}%`);
    } catch (err) {
      console.error(`Error compressing folder ${folder}: ${err}`);
    }
  }

  console.log('Folders compressed and sizes compared.');
};

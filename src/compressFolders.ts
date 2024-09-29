import * as fs from 'fs';
import * as path from 'path';
import { getFolderSize } from './reportSize';
const archiver = require('archiver');

// Function to zip a directory and return the size of the zip file
const zipDirectory = (sourceDir: string, outPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      const output = fs.createWriteStream(outPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        const zipSize = fs.statSync(outPath).size; // Get the size of the zip file after compression
        resolve(zipSize);
      });

      archive.on('error', (err: Error) => {
        console.error(`Error occurred during zipping: ${err.message}`);
        reject(new Error(`Failed to zip directory: ${sourceDir}`));
      });

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    } catch (err) {
      console.error(`Error in zipping process: ${err}`);
      reject(new Error(`Failed to zip directory: ${sourceDir}`));
    }
  });
};

// Function to compress folders and compare file sizes before and after zipping
export const compressFolders = async () => {
  try {
    const outputDir = path.join(__dirname, '..', 'output');
    const zipDir = path.join(__dirname, '..', 'zip'); // Folder to store the zip files
    const reportDir = path.join(__dirname, '..', 'report'); // Folder to store the report

    // Create the "zip" and "report" folders if they don't exist
    if (!fs.existsSync(zipDir)) {
      fs.mkdirSync(zipDir);
    }
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
    }

    const folders = fs.readdirSync(outputDir);

    // Prepare the report data
    let reportData = 'Size Comparison Report:\n\n';

    for (const folder of folders) {
      const folderPath = path.join(outputDir, folder);
      const zipName = folder.toLowerCase(); // Zip file name in lowercase
      const zipPath = path.join(zipDir, `${zipName}.zip`); // Store zip files inside "zip" folder

      // Get the size of the folder before compression
      const folderSizeBefore = getFolderSize(folderPath);
      const folderSizeKB = (folderSizeBefore / 1000).toFixed(2); // Size in KB

      console.log(`${folder} - Size before compression: ${folderSizeKB} KB`);

      // Zip the folder and get the size of the zip file after compression
      try {
        const zipSize = await zipDirectory(folderPath, zipPath);
        const zipSizeKB = (zipSize / 1000).toFixed(2); // Size in KB
        const compressionRatio = (zipSize / folderSizeBefore * 100).toFixed(2);

        console.log(`${folder} - Size after compression: ${zipSizeKB} KB`);
        console.log(`${folder} - Compression ratio: ${compressionRatio}%`);

        // Append size comparison data to the report
        reportData += `${folder}:\n`;
        reportData += `  Size before compression: ${folderSizeKB} KB\n`;
        reportData += `  Size after compression: ${zipSizeKB} KB\n`;
        reportData += `  Compression ratio: ${compressionRatio}%\n\n`;

      } catch (err) {
        console.error(`Error compressing folder ${folder}: ${err}`);
        throw new Error(`Compression failed for folder: ${folder}`);
      }
    }

    // Write the report to a sizecomparing.txt file inside the "report" folder
    const reportFilePath = path.join(reportDir, 'sizecomparing.txt');
    fs.writeFileSync(reportFilePath, reportData);

    console.log('Folders compressed and sizes compared.');
    console.log(`Size comparison report saved to: ${reportFilePath}`);
  } catch (err) {
    console.error(`Error in compressFolders function: ${err}`);
    throw new Error('Failed to compress folders.');
  }
};

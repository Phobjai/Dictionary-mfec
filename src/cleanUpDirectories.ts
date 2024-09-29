import * as fs from 'fs';
import * as path from 'path';

// Function to delete the directory and its contents (top-level delete)
const deleteDirectoryIfExists = (dirPath: string) => {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true }); // Remove directory and everything inside
    console.log(`Deleted directory: ${dirPath}`);
  }
};

// Function to clean up the necessary directories
export const cleanUpDirectories = () => {
  const outputDir = path.join(__dirname, '..', 'output');
  const reportDir = path.join(__dirname, '..', 'report');
  const zipDir = path.join(__dirname, '..', 'zip');

  // Delete the directories if they exist
  deleteDirectoryIfExists(outputDir);
  deleteDirectoryIfExists(reportDir);
  deleteDirectoryIfExists(zipDir);
};
import * as fs from 'fs';
import * as path from 'path';

export const organizeFiles = () => {
  const outputDir = path.join(__dirname, '..', 'output');
  const files = fs.readdirSync(outputDir);

  // Organize files by two-level folder structure
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const word = file.replace('.txt', '');

    try {
      // If the word has only 1 character, move it to the first-level directory
      if (word.length === 1) {
        const firstLetter = word[0].toUpperCase();
        const folderPath = path.join(outputDir, firstLetter);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        const oldPath = path.join(outputDir, file);
        const newPath = path.join(folderPath, file);

        // Avoid moving a folder into itself
        if (oldPath !== newPath) {
          fs.renameSync(oldPath, newPath);
        } else {
          console.warn(`Skipping move of ${file} to itself.`);
        }

      } else if (word.length >= 2) {
        // For words with 2 or more characters, use the two-level folder structure
        const firstLetter = word[0].toUpperCase();
        const secondLetter = word[1].toUpperCase();
        const folderPath = path.join(outputDir, firstLetter, secondLetter);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        const oldPath = path.join(outputDir, file);
        const newPath = path.join(folderPath, file);

        // Avoid moving a folder into itself
        if (oldPath !== newPath) {
          fs.renameSync(oldPath, newPath);
        } else {
          console.warn(`Skipping move of ${file} to itself.`);
        }
      }

    } catch (error) {
      console.error(`Error moving file ${file}:`);
     
      throw new Error(`Error moving file ${file}`);

    }
  }

};

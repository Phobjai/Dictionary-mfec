import * as fs from 'fs';
import * as path from 'path';

// Path to the dictionary file
const dictionaryPath = path.join(__dirname, '..', 'dictionary.txt');

// Function to create text files for each word
export const createTextFiles = () => {
  const data:string = fs.readFileSync(dictionaryPath, 'utf-8');
  const words:string[] = data.split('\n').map(word => word.trim().toLowerCase());

  // Directory to store output files
  const outputDir = path.join(__dirname, '..', 'output');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Create a text file for each word with the word repeated 100 times
  words.forEach(word => {
    if (word) {
      const content = Array(100).fill(word).join('\n');
      const filePath = path.join(outputDir, `${word}.txt`);
      fs.writeFileSync(filePath, content);
    }
  });

  console.log('Text files created successfully.');
};

// createTextFiles();

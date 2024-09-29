import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as fs from 'fs';
import * as path from 'path';

// Function to set up the SQLite database and insert words
export const setupDatabase = async () => {
  const db = await open({
    filename: 'dictionary.db',
    driver: sqlite3.Database
  });

  // Create the words table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL
    );
  `);

  // Read and insert words from the dictionary file
  const dictionaryPath = path.join(__dirname, '..', 'dictionary.txt');
  const words = fs.readFileSync(dictionaryPath, 'utf-8')
    .split('\n')
    .map(word => word.trim().toLowerCase())
    .filter(word => word.length > 0);

  for (const word of words) {
    await db.run('INSERT INTO words (word) VALUES (?)', word);
  }


  await db.close();
};

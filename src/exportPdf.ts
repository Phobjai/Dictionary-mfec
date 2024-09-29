import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
const PDFDocument = require('pdfkit');
import * as fs from 'fs';


// Function to export words from the database into a PDF file
export const exportToPDF = async () => {
  // Open the database
  const db = await open({
    filename: 'dictionary.db',
    driver: sqlite3.Database
  });

  // Create a new PDF document
  const doc = new PDFDocument({
    size: 'A4',  // Set size to A4
    margin: 50   // Set margin for A4 page
  });

  // Create a write stream for the PDF file
  const pdfPath = 'words.pdf';
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // Retrieve all words from the database
  const words = await db.all('SELECT word FROM words');

  // Add each word to the PDF, one per line
  doc.fontSize(12);  

   // Write the word on pdf
  words.forEach((row: { word: string }) => {
    doc.text(row.word); 
  });

  doc.end();

  console.log(`PDF generated: ${pdfPath}`);

  // Close the database connection
  await db.close();
};

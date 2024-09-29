import * as fs from 'fs';
import * as path from 'path';

// Calculate size of the directory
export const getFolderSize = (folderPath: string): number => {
  let totalSize = 0;

  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      totalSize += stats.size; 
    } else if (stats.isDirectory()) {
    
    // Recursively calculate subdirectory size
      totalSize += getFolderSize(filePath); 
    }
  });

  return totalSize;
};

// Function to report folder size and create a report.txt file with total size
export const reportFolderSize = () => {
  const outputDir = path.join(__dirname, '..', 'output');
  const reportDir = path.join(__dirname, '..', 'report');
  const folders = fs.readdirSync(outputDir);
  


  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir);
  }


  // for being report of report.txt
  let reportData = 'Report of folder sizes:\n'; 

  // Initialize total size accumulator
  let grandTotalSize = 0;

  console.log('Report of folder sizes:');
  folders.forEach(folder => {
    const folderPath = path.join(outputDir, folder);
    const totalSize = getFolderSize(folderPath); 
    const sizeKB = (totalSize / 1000).toFixed(2);

    console.log(`${folder} - ${sizeKB} KB`);
    
    // Append the folder size info to the report
    reportData += `${folder} - ${sizeKB} KB\n`;

    // Add to grand total size
    grandTotalSize += totalSize;
  });

  // Calculate the total size in KB
  const totalSizeKB = (grandTotalSize / 1000).toFixed(2);
  
  // Append total size to report
  reportData += `\nTotal size: ${totalSizeKB} KB\n`;

  // Write the report to a report.txt file inside the output directory
  const reportFilePath = path.join(reportDir, 'report.txt');
  fs.writeFileSync(reportFilePath, reportData);

  console.log(`\nTotal size of all folders: ${totalSizeKB} KB`);
  // console.log(`Folder size report saved to: ${reportFilePath}`);
};

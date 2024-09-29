import * as fs from 'fs';
import * as path from 'path';

// Calculate size of the directory
export const getFolderSize = (folderPath: string): number => {
  let totalSize = 0;

  try {
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
  } catch (error) {
    console.error(`Error calculating size for folder ${folderPath}:`, error);
    throw new Error(`Failed to calculate size for folder: ${folderPath}`);
  }

  return totalSize;
};

// Function to report folder size and create a report.txt file with total size
export const reportFolderSize = () => {
  const outputDir = path.join(__dirname, '..', 'output');
  const reportDir = path.join(__dirname, '..', 'report');

  try {
    const folders = fs.readdirSync(outputDir);

    // Ensure report directory exists
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
    }

    // Initialize report for report.txt
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

    // Write the report to a report.txt file inside the report directory
    const reportFilePath = path.join(reportDir, 'report.txt');
    fs.writeFileSync(reportFilePath, reportData);

    console.log(`\nTotal size of all folders: ${totalSizeKB} KB`);
    console.log(`Folder size report saved to: ${reportFilePath}`);
  } catch (error) {
    console.error('Error generating folder size report:', error);
    throw new Error('Failed to generate folder size report');
  }
};

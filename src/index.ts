import { createTextFiles } from './createFiles';
import { organizeFiles } from './organizeFiles';
import { reportFolderSize } from './reportSize';
import { compressFolders } from './compressFolders';
import { setupDatabase } from './insertData';
import { exportToPDF } from './exportPdf';
import { cleanUpDirectories } from './cleanUpDirectories';

// Function to run a task and return a boolean indicating success or failure
const runStep = async (stepName: string, task: () => Promise<void> | void): Promise<boolean> => {
  try {
    await task();
    console.log(`${stepName}: Success`);
    return true;  // Return true if the task succeeds
  } catch (error) {
    console.error(`${stepName}: Failed with error:`, error);
    return false;  // Return false if the task fails
  }
};

const main = async () => {
  try {
    console.log('Starting the process...');

    // Step 0: Clean up directories
    if (!await runStep('Step 0: Cleaning up directories', cleanUpDirectories)) return;

    // Step 1 & 2: Create text files for each word
    if (!await runStep('Step 1 & 2: Creating text files', createTextFiles)) return;

    // Step 3 & 4: Organizing files into a two-level directory structure
    if (!await runStep('Step 3 & 4: Organizing files', organizeFiles)) return;

    // Step 5: Generating folder size report
    if (!await runStep('Step 5: Reporting folder sizes', reportFolderSize)) return;

    // Step 6: Compressing folders and comparing sizes
    if (!await runStep('Step 6: Compressing folders', compressFolders)) return;

    // // Step 7: Setting up the database and inserting data
    if (!await runStep('Step 7: Setting up database', setupDatabase)) return;

    // // Step 8: Exporting data to PDF
    if (!await runStep('Step 8: Exporting to PDF', exportToPDF)) return;

    console.log('All tasks completed.');
  } catch (error) {
    console.error('An error occurred during the process:', error);
  }
};

main();

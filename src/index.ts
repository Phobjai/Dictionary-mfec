import { execSync } from 'child_process';
import { createTextFiles } from './createFiles';
import { organizeFiles } from './organizeFiles';
import { reportFolderSize } from './reportSize';



const main = async () => {
  try {
    console.log('Step 1 & 2: Creating text files for each word...');
    createTextFiles();

    console.log('Step 3 & 4: Organizing files into a two-level directory structure...');
    organizeFiles();

    console.log('Step 5: Generating folder size report...');
    reportFolderSize();
   
    console.log('All steps completed successfully!');
  } catch (error) {
    console.error('An error occurred during the process:', error);
  }
};

main();

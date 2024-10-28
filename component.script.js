const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk'); // Import chalk for colored logs

// List of allowed directories to copy from, now including src and subfolders like css and js
const allowedDirs = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates', 'src'];

// Function to parse the command-line arguments and extract --component
function getComponentName() {
    const args = process.argv.slice(2); // Get command-line arguments (excluding `node` and script path)
    let componentName = null;

    // Loop through arguments and find the --component flag
    args.forEach(arg => {
        if (arg.startsWith('--component=')) {
            componentName = arg.split('=')[1]; // Extract the value after the '='
        }
    });

    return componentName;
}

// Store copied files to display later
let copiedFiles = [];

// Store skipped files if they already exist
let skippedFiles = [];

// Function to recursively copy files from source to target directories
async function copyFilesRecursively(sourcePath, targetPath) {
    const files = await fs.readdir(sourcePath);

    for (const file of files) {
        const sourceFile = path.join(sourcePath, file);
        const targetFile = path.join(targetPath, file);

        // Check if it's a directory
        if (await fs.stat(sourceFile).then(stats => stats.isDirectory())) {
            // If it's a directory, recursively copy its contents
            await copyFilesRecursively(sourceFile, targetFile);
        } else {
            // If it's a file, copy it if it doesn't already exist
            if (fs.existsSync(targetFile)) {
                console.log(chalk.yellow(`Skipping: ${targetFile} (already exists)`));
                skippedFiles.push({
                    fileName: file,
                    source: sourceFile,
                    destination: targetFile,
                });
            } else {
                try {
                    await fs.copy(sourceFile, targetFile);
                    console.log(chalk.green(`Copied: ${sourceFile} to ${targetFile}`));
                    copiedFiles.push({
                        fileName: file,
                        source: sourceFile,
                        destination: targetFile,
                    });
                } catch (err) {
                    console.error(chalk.red(`Error copying ${sourceFile}:`), err);
                }
            }
        }
    }
}

// Function to copy files from source to target directories
async function copyComponentFiles(componentName) {
    if (!componentName) {
        console.error(chalk.red('Error: --component is required'));
        return;
    }

    // Define the source directory for the component
    const sourceDir = path.join(__dirname, 'src', 'components', componentName);

    // Check if the source directory exists
    if (!fs.existsSync(sourceDir)) {
        console.error(chalk.red(`Error: Component directory "${sourceDir}" does not exist.`));
        return;
    }

    // Get all subdirectories inside the component folder
    const directories = await fs.readdir(sourceDir);

    // Loop over the detected directories and copy files if they are in the allowedDirs
    for (const dir of directories) {
        if (allowedDirs.includes(dir)) {
            const sourcePath = path.join(sourceDir, dir);
            const targetPath = path.join(__dirname, dir); // Target folder matches the subdirectory name

            // If the directory is "src", process its subfolders as well
            if (dir === 'src') {
                const srcSubDirs = await fs.readdir(sourcePath);
                for (const subDir of srcSubDirs) {
                    const srcSubDirPath = path.join(sourcePath, subDir);
                    const targetSubDirPath = path.join(__dirname, 'src', subDir);

                    await copyFilesRecursively(srcSubDirPath, targetSubDirPath);
                }
            } else {
                // Handle non-src directories
                await copyFilesRecursively(sourcePath, targetPath);
            }
        } else {
            console.log(chalk.gray(`Skipping: ${dir} (not in allowed directories)`));
        }
    }
}

// Function to display copied files and skipped files
function displayResults() {
    console.log(chalk.bold('\nCopied files:'));
    if (copiedFiles.length === 0) {
        console.log(chalk.cyan('No files were copied.'));
    } else {
        copiedFiles.forEach(({ fileName, source, destination }) => {
            console.log(chalk.green(`  Copied: ${fileName} from ${source} to ${destination}`));
        });
    }

    console.log(chalk.bold('\nSkipped files (already existed):'));
    if (skippedFiles.length === 0) {
        console.log(chalk.cyan('No files were skipped.'));
    } else {
        skippedFiles.forEach(({ fileName, destination }) => {
            console.log(chalk.yellow(`  Skipped: ${fileName} already exists at ${destination}`));
        });
    }
}

// Function to initiate the copy process for a specific component
async function copyComponent() {
    const componentName = getComponentName();
    if (!componentName) {
        console.error(chalk.red('Error: Please provide --component argument.'));
        return;
    }

    try {
        await copyComponentFiles(componentName);
        console.log(chalk.blue(`\nAll files from component "${componentName}" processed successfully!`));
        displayResults(); // Display copied and skipped files
    } catch (error) {
        console.error(chalk.red(`Error copying component "${componentName}":`), error);
    }
}

// Run the script
copyComponent();

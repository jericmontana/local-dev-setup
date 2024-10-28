import fs from 'fs';
import path from 'path';
import ttf2woff2 from 'ttf2woff2';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const convertTtfToWoff2 = () => {
    const fontsDir = path.join(process.cwd(), 'src', 'fonts');
    const outputDir = path.join(process.cwd(), 'assets');

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read all files in the fonts directory
    fs.readdir(fontsDir, (err, files) => {
        if (err) {
            console.error('Could not list the directory.', err);
            process.exit(1);
        }

        // Filter for .ttf files and convert each one
        files.forEach(file => {
            if (path.extname(file) === '.ttf') {
                const ttfPath = path.join(fontsDir, file);
                const woff2Path = path.join(outputDir, path.basename(file, '.ttf') + '.woff2');

                // Read the TTF file
                const input = fs.readFileSync(ttfPath);

                // Convert to WOFF2 format
                const output = ttf2woff2(input);

                // Write the WOFF2 file to the assets directory
                fs.writeFileSync(woff2Path, output);

                console.log(`Converted ${file} to ${path.basename(woff2Path)} and saved it to the assets folder.`);
            }
        });
    });
};

const convertWithConfirmation = () => {
    rl.question('Convert files (Y/N)?: ', (answer) => {
      if (answer.toUpperCase() === 'Y') {
        convertTtfToWoff2();
      } else {
        console.log('Conversion aborted.');
        process.exit(0);
      }
      rl.close();
    });
};

convertWithConfirmation();

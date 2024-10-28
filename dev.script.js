const concurrently = require('concurrently');

const startDev = async () => {
  const commands = [
    {
      command: 'postcss src/css/*.css -d assets --watch --verbose',
      name: 'PostCSS',
      prefixColor: '#dd3b0a4d'
    },
    {
      command: 'webpack --mode=production --watch',
      name: 'Webpack',
      prefixColor: '#1c78c04d'
    }
  ];

  await concurrently(commands, {
    killOthers: ['failure'],
    pauseInputStreamOnFinish: false,
  });
};

const startDevWithConfirmation = () => {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('Start Local Dev (Y/N)?: ', async (answer) => {
    if (answer.toUpperCase() === 'Y') {
      await startDev();
    } else {
      console.log('Exiting...');
      process.exit(0);
    }
    readline.close();
  });
};

startDevWithConfirmation();
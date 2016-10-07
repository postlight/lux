'use strict'; // eslint-disable-line strict, lines-around-directive

const { EOL } = require('os');
const { exec } = require('child_process');

if (!process.env.APPVEYOR) {
  exec('flow check', (err, data) => {
    process.stdout.write(data);
    process.stdout.write(EOL);
    process.exit(err ? 1 : 0);
  });
}

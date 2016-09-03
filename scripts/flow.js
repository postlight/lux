'use strict';

const { exec } = require('child_process');

if (!process.env.APPVEYOR) {
  exec('flow check', (err, data) => {
    console.log(data);
    process.exit(err ? 1 : 0);
  });
}

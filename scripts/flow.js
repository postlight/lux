'use strict';

const WINDOWS = /^win(32|64)$/;

const exec = require('child_process').exec;
const platform = require('os').platform();

if (!WINDOWS.test(platform)) {
  exec('flow check', (err, data) => {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log(data);
      process.exit(0);
    }
  });
}

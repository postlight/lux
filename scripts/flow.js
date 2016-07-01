'use strict';

const WINDOWS = /^win(32|64)$/;

const exec = require('child_process').exec;
const platform = require('os').platform();

if (!WINDOWS.test(platform)) {
  exec('flow check', (err, data) => {
    console.log(data);
    process.exit(err ? 1 : 0);
  });
}

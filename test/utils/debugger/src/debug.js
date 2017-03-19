import childProcess from 'child_process';

// @const spawn
// Spawn commands from a node child process

const { spawn } = childProcess;

// @const repoDir
// Starting CWD in the repo root

const repoDir = process.cwd();

// @function log
// Shortcut for console.log

function log(...msg) { console.log(...msg); }

// @async runCommand
// Run a terminal command

async function runCommand(command, args = [], [ preMsg = '', successMsg = '' ]) {
  log(preMsg);

  return new Promise((resolve, reject) => {
    const run = spawn(command, args);

    run.stderr.on('data', err => {
      log(err.toString());
      reject(err.toString());
    });

    run.stdout.on('data', data => log(data.toString()));

    run.on('exit', () => resolve(successMsg));

  })
  .then(msg => log(msg))
  .catch(err => log(err.toString()));

}

// @async runInspector
// Run the node inspector
// and open URL in Chrome window

async function runInspector() {
  log('Starting node inspector...');

  return new Promise((resolve, reject) => {

    const inspectArgs = '--inspect=4000 dist/boot.js'.split(' ');
    const run = spawn('node', inspectArgs);

    let url;

    function openURL(url) {
      runCommand(
        'osascript',
        ['-e', `tell application "Google Chrome" to open location "${url}"`],
        ['Opening in Google Chrome (OSX Users only)']
      );
    }

    function parseURL(msg) {
      msg = msg.split('chrome-devtools');
      return `chrome-devtools${msg[1]}`.replace(/\s+/g, '');
    }

    run.stderr.on('data', msg => {
      if (url) { return; }
      msg = msg.toString();
      log(msg);
      url = parseURL(msg);
      openURL(url);

    });

    run.stdout.on('data', data => log(data.toString()));

    run.on('exit', (code) => log(`Child exited with code ${code}`));

  })
  .then(msg => log(msg))
  .catch(err => log(err.toString));

}

// @listener
// Ensure repoDir is returned to when process exits

process.on('exit', () => {
  process.chdir(repoDir);
});

// @async
// Run commands

(async function() {

  const cleanArgs = 'rm -rf .nyc_output coverage dist test/test-app/dist test-results.xml'.split(' ');

  await runCommand('shx', cleanArgs, ['Cleaning Lux repo...', 'Repo cleaned.']);

  await runCommand('rollup', ['-c'], ['Building Lux source...', 'Lux source built.']);

  process.chdir('./test/test-app');

  await runCommand('lux', ['build'], ['Building Lux test-app...', 'Lux test-app built.']);

  await runInspector();

}());

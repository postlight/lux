/* @flow */

import { spawn } from 'child_process'

// @const repoDir
// Starting CWD in the repo root

const repoDir = process.cwd()

// @function log
// Shortcut for console.log

// eslint-disable-next-line no-console
function log(...msg) { console.log(...msg) }

// @async runCommand
// Run a terminal command

async function runCommand(command, args = [], messages = []) {
  let [preMsg, successMsg] = messages

  if (typeof preMsg === 'undefined') {
    preMsg = ''
  }

  if (typeof successMsg === 'undefined') {
    successMsg = ''
  }

  log(preMsg)

  return new Promise((resolve, reject) => {
    const run = spawn(command, args)

    run.stderr.once('data', reject)
    run.stdout.on('data', data => log(data.toString()))

    run.once('exit', () => resolve(successMsg))
  })
  .then(log)
  .catch(err => log(err.toString()))
}

// @async runInspector
// Run the node inspector
// and open URL in Chrome window

function runInspector() {
  log('Starting node inspector...')

  return new Promise(() => {
    const inspectArgs = '--inspect=4000 dist/boot.js'.split(' ')
    const run = spawn('node', inspectArgs)

    let url

    function openURL(target) {
      runCommand(
        'osascript',
        ['-e', `tell application "Google Chrome" to open location "${target}"`],
        ['Opening in Google Chrome (OSX Users only)']
      )
    }

    function parseURL(source) {
      const parts = source.split('chrome-devtools')

      return `chrome-devtools${parts[1]}`.replace(/\s+/g, '')
    }

    run.stderr.on('data', (buff) => {
      if (url) {
        return
      }

      const msg = buff.toString()

      log(msg)
      url = parseURL(msg)
      openURL(url)
    })

    run.stdout.on('data', data => log(data.toString()))
    run.on('exit', (code) => log(`Child exited with code ${code}`))
  })
  .then(msg => log(msg))
  .catch(err => log(err.toString))
}

// @listener
// Ensure repoDir is returned to when process exits

process.on('exit', () => {
  process.chdir(repoDir)
});

// @async
// Run commands

(async function main() {
  const cleanArgs = [
    'rm',
    '-rf',
    '.nyc_output',
    'coverage',
    'dist',
    'test/test-app/dist',
    'test-results.xml',
  ]

  await runCommand('shx', cleanArgs, [
    'Cleaning Lux repo...',
    'Repo cleaned.',
  ])

  await runCommand('rollup', ['-c'], [
    'Building Lux source...',
    'Lux source built.',
  ])

  process.chdir('./test/test-app')

  await runCommand('lux', ['build'], [
    'Building Lux test-app...',
    'Lux test-app built.',
  ])

  await runInspector()
}())

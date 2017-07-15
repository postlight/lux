/* @flow */

import * as path from 'path'

import * as fs from 'mz/fs'

import * as flatten from '@lux/utils/flatten'

/**
 * Recursively remove files and directories if they exist. YOLO.
 */
const rmrf = (target: string): Promise<boolean> =>
  fs
    .stat(target)
    .then(
      stats =>
        stats.isDirectory()
          ? fs
              .readdir(target)
              .then(files => files.map(file => path.join(target, file)))
              .then(files => files.map(rmrf))
              .then(promises => Promise.all(promises))
              .then(() => fs.rmdir(target))
          : fs.unlink(target),
    )
    .then(() => true)
    .catch(err => {
      if (err.code === 'ENOENT') {
        return true
      }
      return err
    })

/**
 * Determine if a file in a directory matches a pattern.
 */
const existsInDir = (dir: string, pattern: RegExp): Promise<boolean> =>
  fs.readdir(dir).then(files => files.some(file => pattern.test(file)))

/**
 * Recursively read a directory.
 */
const readdirRec = (
  target: string,
  stripPath?: boolean = true,
): Promise<Array<string>> =>
  fs
    .readdir(target)
    .then(files =>
      files
        .map(file => path.join(target, file))
        .map(file => fs.stat(file).then(stats => [file, stats])),
    )
    .then(promises => Promise.all(promises))
    .then(files =>
      files.map(([file, stats]) => {
        if (stats.isDirectory()) {
          return readdirRec(file, false)
        }
        return file
      }),
    )
    .then(promises => Promise.all(promises))
    .then(flatten.shallow)
    .then(
      files =>
        stripPath ? files.map(file => path.relative(target, file)) : files,
    )

/**
 * Recursively create a directory path.
 */
const mkdirRec = (target: string): Promise<void> =>
  fs
    .mkdir(path.dirname(target))
    .catch(err => {
      if (err.code === 'ENOENT') {
        return mkdirRec(path.dirname(target))
      }
      return err
    })
    .then(() => fs.mkdir(target))

/**
 * Higher order function that returns a function that determins if a
 * file has a matching extension.
 */
const isExt = (ext: string): ((file: string) => boolean) => file =>
  path.extname(file) === ext

export { existsInDir, isExt, mkdirRec, readdirRec, rmrf }

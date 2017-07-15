/* @flow */

import * as mockFs from 'fs'
import * as path from 'path'

import * as fs from 'mz/fs'

import * as fse from '@lux/utils/fs-extras'

jest.mock('fs')

// $FlowFixMe
afterEach(mockFs.reset)

describe('rmrf()', () => {
  const root = path.join(path.sep, 'x', 'y', 'z')
  const file = path.join(root, 'test.json')

  beforeEach(async () => {
    await fse.mkdirRec(root)
    await fs.writeFile(file, '{}')
  })

  afterEach(async () => {
    await fse.rmrf(root)
  })

  test('it can remove a file', async () => {
    expect(await fse.rmrf(file)).toBe(true)
    expect(await fs.exists(file)).toBe(false)
  })

  test('it can remove a directory and its contents', async () => {
    expect(await fse.rmrf(root)).toBe(true)
    expect(await fs.exists(root)).toBe(false)
  })

  test('it does not fail if the target does not exist', async () => {
    const target = path.join(root, 'not-a-file')

    expect(await fse.rmrf(target)).toBe(true)
  })

  test('valid errors bubble up', async () => {
    await fse.rmrf('test').catch(err => {
      expect(err).toEqual(expect.any(Error))
    })
  })
})

test('existsInDir()', async () => {
  const root = path.join(path.sep, 'test')

  await fs.mkdir(root)
  await fs.writeFile(path.join(root, 'package.json'), '{}')

  expect(await fse.existsInDir(root, /\.json$/)).toBe(true)
})

test('readdirRec()', async () => {
  await fse.mkdirRec(path.join(path.sep, 'x', 'y', 'z'))
  await Promise.all([
    fs.writeFile(path.join(path.sep, 'x', 'x.txt'), 'test x'),
    fs.writeFile(path.join(path.sep, 'x', 'y', 'y.txt'), 'test y'),
    fs.writeFile(path.join(path.sep, 'x', 'y', 'z', 'z.txt'), 'test z'),
  ])

  expect(await fse.readdirRec(path.join(path.sep, 'x'))).toMatchSnapshot()
})

describe('mkdirRec()', () => {
  test('it can recursively create a directory', async () => {
    const target = path.join(path.sep, 'x', 'y', 'z')

    expect(await fs.exists(target)).toBe(false)

    await fse.mkdirRec(target)
    expect(await fs.exists(target)).toBe(true)
  })

  test('valid errors still bubble up', async () => {
    await fse.mkdirRec('test').catch(err => {
      expect(err).toEqual(expect.any(Error))
    })
  })
})

test('isExt()', () => {
  const isJSFile = fse.isExt('.js')

  expect(isJSFile('test.js')).toBe(true)
  expect(isJSFile('test.json')).toBe(false)
})

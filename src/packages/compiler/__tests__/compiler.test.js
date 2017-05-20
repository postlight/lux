/* @flow */

import * as path from 'path'

const LOCAL = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'index.js',
)

const APP_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'test',
  'test-app',
)

describe('module "compiler"', () => {
  describe('#compile()', () => {
    let rollup
    let compile

    beforeAll(async () => {
      rollup = jest.mock('rollup');
      ({ compile } = require('../index'))
    })

    afterAll(async () => {
      jest.unmock('rollup')
    })

    describe('- with strict mode', () => {
      test('creates an instance with the correct config', async () => {
        await compile(APP_PATH, 'test', {
          local: LOCAL,
          useStrict: true,
        })

        expect(rollup.mock.calls).toMatchSnapshot()
      })
    })

    describe('- without strict mode', () => {
      test('creates an instance with the correct config', async () => {
        await compile(APP_PATH, 'test', {
          local: LOCAL,
          useStrict: false,
        })

        expect(rollup.mock.calls).toMatchSnapshot()
      })
    })
  })

  /* eslint-disable no-console */

  describe('#onwarn()', () => {
    const { warn } = console
    let onwarn

    beforeAll(() => {
      // $FlowIgnore
      console.warn = jest.fn();
      ({ onwarn } = require('../index'))
    })

    afterAll(() => {
      // $FlowIgnore
      console.warn = warn
      jest.resetModules()
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    test('outputs valid warning types to stderr', () => {
      onwarn({ code: 'EMPTY_BUNDLE', message: 'TEST' })

      expect(console.warn).toBeCalled()
      expect(console.warn.mock.calls).toMatchSnapshot()
    })

    test('ignores invalid warning types', () => {
      onwarn({ code: 'UNUSED_EXTERNAL_IMPORT', message: 'TEST' })

      expect(console.warn).not.toBeCalled()
    })
  })

  /* eslint-enable no-console */
})

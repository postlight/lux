/* @flow */

import * as path from 'path'

import { rollup } from 'rollup'

import { compile, onwarn } from '../index'

const APP_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'test',
  'test-app',
)

jest.mock('rollup')

describe('module "compiler"', () => {
  describe('#compile()', () => {
    describe('- with strict mode', () => {
      test('creates an instance with the correct config', async () => {
        await compile({
          directory: APP_PATH,
          environment: 'test',
          useStrict: true,
        })

        expect(rollup.mock.calls).toMatchSnapshot()
      })
    })

    describe('- without strict mode', () => {
      test('creates an instance with the correct config', async () => {
        await compile({
          directory: APP_PATH,
          environment: 'test',
        })

        expect(rollup.mock.calls).toMatchSnapshot()
      })
    })
  })

  /* eslint-disable no-console */

  describe('#onwarn()', () => {
    const { warn } = console

    beforeAll(() => {
      // $FlowFixMe
      console.warn = jest.fn()
    })

    afterAll(() => {
      // $FlowFixMe
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

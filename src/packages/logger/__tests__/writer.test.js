/* @flow */

import { WARN, ERROR, LEVELS, FORMATS } from '../constants'
import * as writer from '../writer'

const { stdout: { write: writeOut }, stderr: { write: writeErr } } = process

describe('module "logger/writer"', () => {
  describe('#createWriter()', () => {
    beforeAll(() => {
      global.process.stdout.write = jest.fn()
      global.process.stderr.write = jest.fn()
    })

    afterAll(() => {
      global.process.stdout.write = writeOut
      global.process.stderr.write = writeErr
    })

    FORMATS.forEach(format => {
      describe(`- format "${format}"`, () => {
        let subject

        beforeAll(() => {
          subject = writer.create(format)
        })

        LEVELS.forEach((num, level) => {
          describe(`- level "${level}"`, () => {
            test('can write message objects', () => {
              const message = 'Hello world!'
              let mockForLevel

              subject({
                level,
                message,
                timestamp: new Date().toISOString(),
              })

              switch (level) {
                case WARN:
                case ERROR:
                  mockForLevel = process.stderr.write
                  break

                default:
                  mockForLevel = process.stdout.write
                  break
              }

              expect(mockForLevel).toBeCalled()
            })

            test('can write nested message objects', () => {
              const message = { message: 'Hello world!' }
              let mockForLevel

              subject({
                level,
                message,
                timestamp: new Date().toISOString(),
              })

              switch (level) {
                case WARN:
                case ERROR:
                  mockForLevel = process.stderr.write
                  break

                default:
                  mockForLevel = process.stdout.write
                  break
              }

              expect(mockForLevel).toBeCalled()
            })

            if (level === ERROR) {
              test('can write error stack traces', () => {
                const message = new Error('Test')

                subject({
                  level,
                  message,
                  timestamp: new Date().toISOString(),
                })

                expect(process.stderr.write).toBeCalled()
              })
            }
          })
        })
      })
    })
  })
})

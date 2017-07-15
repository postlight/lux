/* @flow */

type Environment = 'development' | 'production' | 'test'

export default function setEnv(value: Environment): void {
  global.process.env.NODE_ENV = value
}

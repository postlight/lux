/* @flow */

import { FreezeableMap, FreezeableSet } from '@lux/packages/freezeable'

import type { Level, Format } from './index'

export const DEBUG = 'DEBUG'
export const INFO = 'INFO'
export const WARN = 'WARN'
export const ERROR = 'ERROR'

export const FORMATS: FreezeableSet<Format> = new FreezeableSet([
  'text',
  'json',
])

FORMATS.freeze()

export const LEVELS: FreezeableMap<Level, number> = new FreezeableMap([
  [DEBUG, 0],
  [INFO, 1],
  [WARN, 2],
  [ERROR, 3],
])

LEVELS.freeze()

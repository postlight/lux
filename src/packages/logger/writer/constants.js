/* @flow */

import ansiRegex from 'ansi-regex'

export const ANSI = ansiRegex()
export const STDOUT = /^(DEBUG|INFO)$/
export const STDERR = /^(WARN|ERROR)$/

/* @flow */

import { createInterface } from 'readline'

const YES = /^y(es)?$/i

export default function createPrompt() {
  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  prompt.setPrompt('')

  return {
    question(text: string): Promise<boolean> {
      return new Promise(resolve => {
        prompt.question(text, answer => {
          resolve(YES.test(answer))
        })
      })
    },

    close(): void {
      prompt.close()
    },
  }
}

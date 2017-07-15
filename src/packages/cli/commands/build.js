/* @flow */

import Ora from 'ora'

import { compile } from '@lux/packages/compiler'
import * as env from '@lux/utils/env'

export async function build(useStrict: boolean = false): Promise<void> {
  const spinner = new Ora({
    text: 'Building your application...',
    spinner: 'dots',
  })

  spinner.start()

  await compile({
    directory: process.cwd(),
    environment: env.name(),
    useStrict,
  })

  spinner.stop()
}

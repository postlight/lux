import Ora from 'ora'

import { CWD, NODE_ENV } from '../../../constants'
import { compile } from '../../compiler'

export async function build(useStrict: boolean = false): Promise<void> {
  const spinner = new Ora({
    text: 'Building your application...',
    spinner: 'dots'
  })

  spinner.start()

  await compile(CWD, NODE_ENV, {
    useStrict
  })

  spinner.stop()
}

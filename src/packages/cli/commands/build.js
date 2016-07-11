import Ora from 'ora';

import { CWD, NODE_ENV } from '../../../constants';
import { compile } from '../../compiler';

import fs from '../../fs';
import { red } from 'chalk';
import path from 'path';

export async function build(useStrict: boolean = false): Promise<void> {
  const spinner = new Ora({
    text: 'Building your application...',
    spinner: 'dots'
  });

  spinner.start();

  await Promise.all([
    fs.readdirAsync(path.join(CWD, 'app', 'models')),
    fs.readdirAsync(path.join(CWD, 'app', 'controllers')),
    fs.readdirAsync(path.join(CWD, 'app', 'serializers')),
    fs.readdirAsync(path.join(CWD, 'db', 'migrate')),
    fs.readdirAsync(path.join(CWD, 'config', 'environments')),
  ]).catch(err => {
    spinner.stop();
    console.log(red('Project directory structure is invalid'));
    console.log(red('You must be in a root directory of a project to build'));
    console.log(red(err));
    process.exit(1);
  });

  await compile(CWD, NODE_ENV, {
    useStrict
  });

  spinner.stop();

}

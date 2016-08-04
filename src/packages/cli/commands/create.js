import Ora from 'ora';
import { green } from 'chalk';

import { CWD } from '../../../constants';

import fs from '../../fs';
import template from '../../template';

import exec from '../../../utils/exec';
import driverFor from '../utils/driver-for';

import { generate } from './generate';

import appTemplate from '../templates/application';
import configTemplate from '../templates/config';
import routesTemplate from '../templates/routes';
import dbTemplate from '../templates/database';
import seedTemplate from '../templates/seed';
import pkgJSONTemplate from '../templates/package-json';
import babelrcTemplate from '../templates/babelrc';
import eslintrcTemplate from '../templates/eslintrc';
import readmeTemplate from '../templates/readme';
import licenseTemplate from '../templates/license';
import gitignoreTemplate from '../templates/gitignore';

/**
 * @private
 */
export async function create(name, database) {
  const driver = driverFor(database);
  const project = `${CWD}/${name}`;

  await fs.mkdirAsync(project);

  await Promise.all([
    fs.mkdirAsync(`${project}/app`),
    fs.mkdirAsync(`${project}/config`),
    fs.mkdirAsync(`${project}/db`)
  ]);

  await Promise.all([
    fs.mkdirAsync(`${project}/app/models`),
    fs.mkdirAsync(`${project}/app/serializers`),
    fs.mkdirAsync(`${project}/app/controllers`),
    fs.mkdirAsync(`${project}/app/middleware`),
    fs.mkdirAsync(`${project}/config/environments`),
    fs.mkdirAsync(`${project}/db/migrate`)
  ]);

  await Promise.all([
    fs.writeFileAsync(
      `${project}/app/index.js`,
      appTemplate(name),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/app/routes.js`,
      routesTemplate(),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/config/environments/development.js`,
      configTemplate(name, 'development'),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/config/environments/test.js`,
      configTemplate(name, 'test'),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/config/environments/production.js`,
      configTemplate(name, 'production'),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/config/database.js`,
      dbTemplate(name, driver),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/db/seed.js`,
      seedTemplate(),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/README.md`,
      readmeTemplate(name),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/LICENSE`,
      licenseTemplate(),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/package.json`,
      pkgJSONTemplate(name, database),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/.babelrc`,
      babelrcTemplate(),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/.eslintrc.json`,
      eslintrcTemplate(),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/.gitignore`,
      gitignoreTemplate(),
      'utf8'
    )
  ]);

  const logOutput = template`
    ${green('create')} app/index.js
    ${green('create')} app/routes.js
    ${green('create')} bin/app.js
    ${green('create')} config/environments/development.js
    ${green('create')} config/environments/test.js
    ${green('create')} config/environments/production.js
    ${green('create')} config/database.js
    ${green('create')} db/migrate
    ${green('create')} db/seed.js
    ${green('create')} README.md
    ${green('create')} LICENSE
    ${green('create')} package.json
    ${green('create')} .babelrc
    ${green('create')} .eslintrc.json
    ${green('create')} .gitignore
  `;

  console.log(logOutput.substr(0, logOutput.length - 1));

  await Promise.all([
    generate({
      cwd: project,
      type: 'serializer',
      name: 'application'
    }),

    generate({
      cwd: project,
      type: 'controller',
      name: 'application'
    })
  ]);

  await exec('git init && git add .', {
    cwd: project
  });

  console.log(`${green('initialize')} git`);

  const spinner = new Ora({
    text: 'Installing dependencies from npm...',
    spinner: 'dots'
  });

  spinner.start();

  await exec('npm install', {
    cwd: project
  });

  await exec(`npm install --save --save-exact ${driver}`, {
    cwd: project
  });

  spinner.stop();
}

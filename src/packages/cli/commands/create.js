import Ora from 'ora';
import Promise from 'bluebird';
import { green } from 'colors/safe';

import fs from '../../fs';
import exec from '../utils/exec';

import generate from './generate';

import appTemplate from '../templates/application';
import appBinaryTemplate from '../templates/app-binary';
import configTemplate from '../templates/config';
import routesTemplate from '../templates/routes';
import dbJSONTemplate from '../templates/database-json';
import pkgJSONTemplate from '../templates/package-json';
import babelRcTemplate from '../templates/babel-rc';
import readmeTemplate from '../templates/readme';
import licenseTemplate from '../templates/license';
import gitignoreTemplate from '../templates/gitignore';

export default async function create(name) {
  const project = `${process.env.PWD}/${name}`;

  await fs.mkdirAsync(project);

  await Promise.all([
    fs.mkdirAsync(`${project}/app`),
    fs.mkdirAsync(`${project}/bin`),
    fs.mkdirAsync(`${project}/config`)
  ]);

  await Promise.all([
    fs.mkdirAsync(`${project}/app/models`),
    fs.mkdirAsync(`${project}/app/serializers`),
    fs.mkdirAsync(`${project}/app/controllers`),
    fs.mkdirAsync(`${project}/config/environments`)
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
      `${project}/bin/app.js`,
      appBinaryTemplate(),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/config/environments/development.json`,
      configTemplate(name, 'development'),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/config/environments/test.json`,
      configTemplate(name, 'test'),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/config/environments/production.json`,
      configTemplate(name, 'production'),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/config/database.json`,
      dbJSONTemplate(name),
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
      pkgJSONTemplate(name),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/.babelrc`,
      babelRcTemplate(),
      'utf8'
    ),

    fs.writeFileAsync(
      `${project}/.gitignore`,
      gitignoreTemplate(),
      'utf8'
    )
  ]);

  console.log(`
${green('create')} app/index.js
${green('create')} app/routes.js
${green('create')} bin/app.js
${green('create')} config/environments/development.json
${green('create')} config/environments/test.json
${green('create')} config/environments/production.json
${green('create')} config/database.json
${green('create')} README.md
${green('create')} LICENSE
${green('create')} package.json
${green('create')} .babelrc
${green('create')} .gitignore
  `.substr(1).trim());

  await Promise.all([
    generate('serializer', 'application', project),
    generate('controller', 'application', project)
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

  spinner.stop();
}

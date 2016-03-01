import Promise from 'bluebird';

import fs from '../../fs';
import exec from '../utils/exec';

import generate from './generate';

import appTemplate from '../templates/application';
import routesTemplate from '../templates/routes';
import dbJSONTemplate from '../templates/database-json';
import pkgJSONTemplate from '../templates/package-json';
import readmeTemplate from '../templates/readme';
import licenseTemplate from '../templates/license';
import gitignoreTemplate from '../templates/gitignore';

export default async function create(name) {
  const project = `${process.env.PWD}/${name}`;

  await fs.mkdirAsync(project);

  await Promise.all([
    fs.mkdirAsync(`${project}/app`),
    fs.mkdirAsync(`${project}/config`)
  ]);

  await Promise.all([
    Promise.all([
      fs.mkdirAsync(`${project}/app/models`),
      fs.mkdirAsync(`${project}/app/serializers`),
      fs.mkdirAsync(`${project}/app/controllers`)
    ]),

    Promise.all([
      fs.writeFileAsync(
        `${project}/app/index.js`,
        appTemplate(name),
        'utf8'
      ),

      fs.writeFileAsync(
        `${project}/app/routes.js`,
        routesTemplate(),
        'utf8'
      )
    ]),

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
      `${project}/.gitignore`,
      gitignoreTemplate(),
      'utf8'
    )
  ]);

  await Promise.all([
    generate('serializer', 'application', project),
    generate('controller', 'application', project)
  ]);

  await Promise.all([
    /*
    exec('npm install', {
      cwd: project
    }),
    */

    exec('git init && git add .', {
      cwd: project
    })
  ]);
}

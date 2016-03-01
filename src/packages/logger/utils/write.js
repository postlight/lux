import fs from 'fs';

import ansiRegex from 'ansi-regex';

export default async function write(path, message) {
  message = message.replace(ansiRegex(), '');
  fs.appendFile(path, message, 'utf8', err => {
    if (err) {
      console.error(err);
    }
  });
}

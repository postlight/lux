import fs from '../../fs';

import ansiRegex from 'ansi-regex';

export default async function write(path, message) {
  try {
    message = message.replace(ansiRegex(), '');
    await fs.appendFileAsync(path, message, 'utf8');
  } catch (err) {
    console.error(err);
  }
}

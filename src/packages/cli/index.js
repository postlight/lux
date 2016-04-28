import cli from 'commander';

import test from './commands/test';
import serve from './commands/serve';
import create from './commands/create';
import destroy from './commands/destroy';
import generate from './commands/generate';

import tryCatch from '../../utils/try-catch';

cli.version('0.0.1-beta.6');

cli
  .command('n <name>')
  .alias('new')
  .description('Create a new application')
  .action(async name => {
    await tryCatch(async () => {
      await create(name);
    }, err => {
      console.error(err);
      process.exit(1);
    });
  });

cli
  .command('t')
  .alias('test')
  .description('Run your app\'s tests')
  .action(async (...args) => {
    await tryCatch(async () => {
      await test();
    }, err => {
      console.error(err);
      process.exit(1);
    });
  });

cli
  .command('s')
  .alias('serve')
  .description('Serve your application')
  .option('-e, --environment', '(Default: development)')
  .option('-p, --port', '(Default: 4000)')
  .action(async (...args) => {
    await tryCatch(async () => {
      let port = 4000;

      args.forEach(arg => {
        if (/^\d+$/ig.test(arg)) {
          port = parseInt(arg, 10);
        } else if (/^\w+$/ig.test(arg)) {
          process.env.NODE_ENV = arg;
        }
      });

      await serve(port);
    }, err => {
      console.error(err);
      process.exit(1);
    });
  });

cli
  .command('g')
  .alias('generate')
  .description('Example: lux generate model user')
  .option('type')
  .option('name')
  .action(async (type, name) => {
    await tryCatch(async () => {
      if (typeof type === 'string' && typeof name === 'string') {
        await generate(type, name);
      } else {
        throw new TypeError('Invalid arguements for type or name');
      }
    }, err => {
      console.error(err);
      process.exit(1);
    });
  });

cli
  .command('d')
  .alias('destroy')
  .description('Example: lux destroy model user')
  .option('type')
  .option('name')
  .action(async (type, name) => {
    await tryCatch(async () => {
      if (typeof type === 'string' && typeof name === 'string') {
        await destroy(type, name);
      } else {
        throw new TypeError('Invalid arguements for type or name');
      }
    }, err => {
      console.error(err);
      process.exit(1);
    });
  });

cli.parse(process.argv);

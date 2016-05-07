import cli from 'commander';

import {
  test,
  serve,
  create,
  destroy,
  generate,
  dbCreate,
  dbDrop,
  dbSeed,
  dbMigrate,
  dbRollback
} from './commands';

import tryCatch from '../../utils/try-catch';
import { version as VERSION } from '../../../package.json';

const { argv, exit, env: { PWD } } = process;

cli.version(VERSION);

cli
  .command('n <name>')
  .alias('new')
  .description('Create a new application')
  .action(async name => {
    await tryCatch(async () => {
      await create(name);
      exit(0);
    }, err => {
      console.error(err);
      exit(1);
    });
  });

cli
  .command('t')
  .alias('test')
  .description('Run your app\'s tests')
  .action(async (...args) => {
    await tryCatch(async () => {
      await test();
      exit(0);
    }, err => {
      console.error(err);
      exit(1);
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
      exit(1);
    });
  });

cli
  .command('g')
  .alias('generate')
  .description('Example: lux generate model user')
  .option('type')
  .option('name')
  .action(async (type, name, ...args) => {
    await tryCatch(async () => {
      if (typeof type === 'string' && typeof name === 'string') {
        args = args.filter(a => typeof a === 'string');
        await generate(type, name, PWD, args);
        exit(0);
      } else {
        throw new TypeError('Invalid arguements for type or name');
      }
    }, err => {
      console.error(err);
      exit(1);
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
        exit(0);
      } else {
        throw new TypeError('Invalid arguements for type or name');
      }
    }, err => {
      console.error(err);
      exit(1);
    });
  });

cli
  .command('db:create')
  .description('Create your database schema')
  .action(async () => {
    await tryCatch(async () => {
      await dbCreate();
      exit(0);
    }, err => {
      console.error(err);
      exit(1);
    });
  });

cli
  .command('db:drop')
  .description('Drop your database schema')
  .action(async () => {
    await tryCatch(async () => {
      await dbDrop();
      exit(0);
    }, err => {
      console.error(err);
      exit(1);
    });
  });

cli
  .command('db:reset')
  .description('Drop your database schema and create a new schema')
  .action(async () => {
    await tryCatch(async () => {
      await dbDrop();
      await dbCreate();
      exit(0);
    }, err => {
      console.error(err);
      exit(1);
    });
  });

cli
  .command('db:migrate')
  .description('Run database migrations')
  .action(async () => {
    await tryCatch(async () => {
      await dbMigrate();
      exit(0);
    }, err => {
      console.error(err);
      exit(1);
    });
  });

cli
  .command('db:rollback')
  .description('Rollback the last database migration')
  .action(async () => {
    await tryCatch(async () => {
      await dbRollback();
      exit(0);
    }, err => {
      console.error(err);
      exit(1);
    });
  });

cli
  .command('db:seed')
  .description('Add fixtures to your db from the seed function')
  .action(async () => {
    await tryCatch(async () => {
      await dbSeed();
      exit(0);
    }, err => {
      console.error(err);
      exit(1);
    });
  });

cli.parse(argv);

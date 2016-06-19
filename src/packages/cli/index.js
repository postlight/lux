import cli from 'commander';

import { VALID_DATABASES } from './constants';
import { version as VERSION } from '../../../package.json';

import Watcher from '../watcher';
import { compile } from '../compiler';

import tryCatch from '../../utils/try-catch';

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
} from './commands/index';

/**
 * @private
 */
export default function CLI() {
  const {
    argv,
    exit,

    env: {
      PWD,
      NODE_ENV = 'development'
    }
  } = process;

  /**
   * @private
   */
  function rescue(err) {
    console.error(err);
    exit(1);
  }

  cli.version(VERSION);

  cli
    .command('n <name>')
    .alias('new')
    .description('Create a new application')
    .option('--database [database]', '(Default: sqlite)')
    .action((name, { database = 'sqlite' } = {}) => {
      return tryCatch(async () => {
        if (VALID_DATABASES.indexOf(database) < 0) {
          database = 'sqlite';
        }
        await create(name, database);
        exit(0);
      }, rescue);
    });

  cli
    .command('t')
    .alias('test')
    .description('Run your app\'s tests')
    .action((...args) => {
      return tryCatch(async () => {
        await test();
        exit(0);
      }, rescue);
    });

  cli
    .command('s')
    .alias('serve')
    .description('Serve your application')
    .option('-e, --environment [env]', '(Default: development)')
    .option('-p, --port [port]', '(Default: 4000)')
    .option('-h, --hot', 'Reload when a file change is detected')
    .option('--use-strict', 'Run your application in strict mode')
    .action(({
      environment = NODE_ENV,
      port = 4000,
      hot = (environment === 'development'),
      useStrict = false
    } = {}) => {
      return tryCatch(async () => {
        port = parseInt(port, 10);

        process.env.PORT = port;
        process.env.NODE_ENV = environment;

        if (hot) {
          const watcher = await new Watcher(PWD);

          watcher.on('change', async (changed) => {
            await compile(PWD, environment);
            process.emit('update', changed);
          });
        }

        await compile(PWD, environment, {
          useStrict
        });

        await serve(port);
      }, rescue);
    });

  cli
    .command('g')
    .alias('generate')
    .description('Example: lux generate model user')
    .option('type')
    .option('name')
    .action((type, name, ...args) => {
      return tryCatch(async () => {
        if (typeof type === 'string' && typeof name === 'string') {
          args = args.filter(a => typeof a === 'string');
          await generate(type, name, PWD, args);
          exit(0);
        } else {
          throw new TypeError('Invalid arguements for type or name');
        }
      }, rescue);
    });

  cli
    .command('d')
    .alias('destroy')
    .description('Example: lux destroy model user')
    .option('type')
    .option('name')
    .action((type, name) => {
      return tryCatch(async () => {
        if (typeof type === 'string' && typeof name === 'string') {
          await destroy(type, name);
          exit(0);
        } else {
          throw new TypeError('Invalid arguements for type or name');
        }
      }, rescue);
    });

  cli
    .command('db:create')
    .description('Create your database schema')
    .action(() => {
      return tryCatch(async () => {
        await compile(PWD, NODE_ENV);
        await dbCreate();
        exit(0);
      }, rescue);
    });

  cli
    .command('db:drop')
    .description('Drop your database schema')
    .action(() => {
      return tryCatch(async () => {
        await compile(PWD, NODE_ENV);
        await dbDrop();
        exit(0);
      }, rescue);
    });

  cli
    .command('db:reset')
    .description('Drop your database schema and create a new schema')
    .action(() => {
      return tryCatch(async () => {
        await compile(PWD, NODE_ENV);
        await dbDrop();
        await dbCreate();
        exit(0);
      }, rescue);
    });

  cli
    .command('db:migrate')
    .description('Run database migrations')
    .action(() => {
      return tryCatch(async () => {
        await compile(PWD, NODE_ENV);
        await dbMigrate();
        exit(0);
      }, rescue);
    });

  cli
    .command('db:rollback')
    .description('Rollback the last database migration')
    .action(() => {
      return tryCatch(async () => {
        await compile(PWD, NODE_ENV);
        await dbRollback();
        exit(0);
      }, rescue);
    });

  cli
    .command('db:seed')
    .description('Add fixtures to your db from the seed function')
    .action(() => {
      return tryCatch(async () => {
        await compile(PWD, NODE_ENV);
        await dbSeed();
        exit(0);
      }, rescue);
    });

  cli.parse(argv);
}

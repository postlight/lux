import path from 'path';
import { start as startRepl } from 'repl';

import { CWD } from '../../../constants';

export function repl(): Promise<void> {
  return new Promise(async (resolve) => {
    const app = await require(path.join(CWD, 'dist', 'boot'));
    const { context } = startRepl('> ').on('exit', () => resolve());

    Object.assign(context, {
      app,
      logger: app.logger,
      routes: app.router,
      [app.constructor.name]: app
    });

    app.models.forEach(model => {
      context[model.name] = model;
    });

    app.controllers.forEach(controller => {
      context[controller.constructor.name] = controller;
    });

    app.serializers.forEach(serializer => {
      context[serializer.constructor.name] = serializer;
    });
  });
}

// @flow
import { blue, cyan, magenta, yellow } from 'chalk';

import line from '../utils/line';

import type { RequestLogger$templateData } from './interfaces';

/**
 * @private
 */
export const debugTemplate = ({
  path,
  stats,
  route,
  method,
  params,
  colorStr,
  startTime,
  endTime,
  statusCode,
  statusMessage,
  remoteAddress
}: RequestLogger$templateData) => `\
${line`
  Processed ${cyan(`${method}`)} "${path}" from ${remoteAddress}
  with ${Reflect.apply(colorStr, null, [`${statusCode}`])}
  ${Reflect.apply(colorStr, null, [`${statusMessage}`])} by ${
    route
    ? `${yellow(route.controller.constructor.name)}#${blue(route.action)}`
    : null
  }
`}

${magenta('Params')}

${JSON.stringify(params, null, 2)}

${magenta('Stats')}

${stats.map(({ type, name, duration, controller }) => {
  name = blue(name);

  if (type === 'action') {
    name = `${yellow(controller)}#${name}`;
  }

  return `${pad(endTime, startTime, duration)} ms ${name}`;
}).join('\n')}
${pad(endTime,
      startTime,
      stats.reduce((total, { duration }) => total + duration, 0))} ms Total
${(endTime - startTime).toString()} ms Actual\
`;

/**
 * @private
 */
export const infoTemplate = ({
  path,
  route,
  method,
  params,
  colorStr,
  startTime,
  endTime,
  statusCode,
  statusMessage,
  remoteAddress
}: RequestLogger$templateData) => line`
Processed ${cyan(`${method}`)} "${path}" ${magenta('Params')} ${
  JSON.stringify(params)} from ${remoteAddress
} in ${(endTime - startTime).toString()} ms with ${
  Reflect.apply(colorStr, null, [`${statusCode}`])
} ${
  Reflect.apply(colorStr, null, [`${statusMessage}`])
} by ${
  route
  ? `${yellow(route.controller.constructor.name)}#${blue(route.action)}`
  : null
}
`;

/**
 * @private
 */
const pad = (endTime, startTime, duration) => {
  const maxLength = (endTime - startTime).toString().length;
  let padNum = maxLength - duration.toString().length;

  let padding = '';

  while (padNum > 0) {
    padding += ' ';
    padNum--;
  }

  return padding + duration;
};

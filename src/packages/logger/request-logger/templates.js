// @flow
import { blue, cyan, magenta, yellow } from 'chalk';

import line from '../utils/line';

import type { RequestLogger$templateData } from './interfaces';

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

  return `${duration >= 10 ? duration : ` ${duration}`} ms ${name}`;
}).join('\n')}
${stats.reduce((total, { duration }) => total + duration, 0)} ms Total
${(endTime - startTime).toString()} ms Actual\
`;

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

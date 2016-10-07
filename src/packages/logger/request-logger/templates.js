// @flow
import { blue, cyan, magenta, yellow } from 'chalk';

import line from '../utils/line';

import type { RequestLogger$templateData } from './interfaces';

/**
 * @private
 */
function countDigits(num: number) {
  const digits = Math.floor(Math.log10(num) + 1);

  return digits > 0 && Number.isFinite(digits) ? digits : 1;
}

/**
 * @private
 */
function pad(startTime: number, endTime: number, duration: number) {
  const maxLength = countDigits(endTime - startTime);

  return ' '.repeat(maxLength - countDigits(duration)) + duration;
}

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

${stats.map(stat => {
  const { type, duration, controller } = stat;
  let { name } = stat;

  name = blue(name);

  if (type === 'action') {
    name = `${yellow(controller)}#${name}`;
  }

  return `${pad(startTime, endTime, duration)} ms ${name}`;
}).join('\n')}
${pad(startTime,
      endTime,
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

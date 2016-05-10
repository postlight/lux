import { randomBytes } from 'crypto';

export default (name, env) => {
  let keyPrefix = `${name}`;

  if (env !== 'production') {
    keyPrefix += `::${env}`;
  }

  return `
export default {
  domain: "http://localhost:4000",
  sessionKey: "${keyPrefix}::session",
  sessionSecret: "${randomBytes(32).toString('hex')}"
};
  `.substr(1).trim();
};

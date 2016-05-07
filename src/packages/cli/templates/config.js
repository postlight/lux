import { randomBytes } from 'crypto';

export default (name, env) => {
  let keyPrefix = `${name}`;

  if (env !== 'production') {
    keyPrefix += `::${env}`;
  }

  return `
const domain = "http://localhost:4000";
const sessionKey = "${keyPrefix}::session";
const sessionSecret = "${randomBytes(32).toString('hex')}";

export { domain, sessionKey, sessionSecret };
  `.substr(1).trim();
};

import { randomBytes } from 'crypto';

export default (name) => {
  return `
{
  "sessionKey": "${name}::session",
  "sessionSecret": "${randomBytes(32).toString('hex')}"
}
  `.substr(1).trim();
};

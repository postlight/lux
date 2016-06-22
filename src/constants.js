// @flow
const { env: ENV } = process;

export const CWD = process.cwd();
export const PORT = parseInt(ENV.PORT, 10) || 4000;
export const NODE_ENV = ENV.NODE_ENV || 'development';

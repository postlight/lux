import K from './k';

export function tryCatchSync(fn, rescue = K) {
  try {
    return fn();
  } catch (err) {
    rescue(err);
  }
}

export default async function tryCatch(fn, rescue = K) {
  try {
    return await fn();
  } catch (err) {
    await rescue(err);
  }
}

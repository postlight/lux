export function tryCatchSync(fn, rescue) {
  try {
    return fn();
  } catch (err) {
    rescue(err);
  }
}

export default async function tryCatch(fn, rescue) {
  try {
    return await fn();
  } catch (err) {
    await rescue(err);
  }
}

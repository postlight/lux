import { hash, compare } from 'bcrypt-as-promised';

const saltRounds = 10;

export function hashPassword(password) {
  return hash(password, saltRounds);
}

export function comparePassword(password, hash) {
  return compare(password, hash)
}

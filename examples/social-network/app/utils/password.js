import { randomBytes, createCipher, createDecipher } from 'crypto';

export function generateSalt() {
  return randomBytes(16).toString('hex');
}

export function encryptPassword(str, secret) {
  let encrypted;
  const cipher = createCipher('aes-256-ctr', secret);

  encrypted = cipher.update(str, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptPassword(hash, secret) {
  let decrypted;
  const decipher = createDecipher('aes-256-ctr', secret);

  decrypted = decipher.update(hash, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

import crypto from 'crypto';

export default function encrypt(str, secret) {
  let encrypted;
  const cipher = crypto.createCipher('aes-256-ctr', secret);

  encrypted = cipher.update(str, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

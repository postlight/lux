import crypto from 'crypto';

export default function decrypt(hash, secret) {
  let decrypted;
  const decipher = crypto.createDecipher('aes-256-ctr', secret);

  decrypted = decipher.update(hash, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

// N=2^14, r=8, p=5 is one of OWASP's recommended scrypt settings
const KEY_LENGTH = 64;
const OPTIONS = { N: 16384, r: 8, p: 5 };

function scryptAsync(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password, salt, KEY_LENGTH, OPTIONS, (err, key) =>
      err ? reject(err) : resolve(key),
    ),
  );
}

// Returns "salt:hash" (both hex), ready to store in users.password_hash
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  const attempt = await scryptAsync(password, Buffer.from(salt, 'hex'));
  return timingSafeEqual(attempt, Buffer.from(hash, 'hex'));
}

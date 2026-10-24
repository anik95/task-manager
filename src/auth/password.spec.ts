import { hashPassword, verifyPassword } from './password.js';

describe('password', () => {
  it('verifies the right password and rejects the wrong one', async () => {
    const stored = await hashPassword('secret123');

    expect(stored).not.toContain('secret123');
    expect(await verifyPassword('secret123', stored)).toBe(true);
    expect(await verifyPassword('wrong', stored)).toBe(false);
  });

  it('gives different hashes for the same password', async () => {
    expect(await hashPassword('same')).not.toBe(await hashPassword('same'));
  });
});

import bcrypt from 'bcryptjs';

export const hashString = async (value: string) => {
  const saltRounds = 10;
  const hashedString = await bcrypt.hash(value, saltRounds);
  return hashedString;
};

export const compareHash = async (value: string, hash: string) => {
  return await bcrypt.compare(value, hash);
};

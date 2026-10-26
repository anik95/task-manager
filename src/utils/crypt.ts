import bycrpt from 'bcryptjs';

export const hashString = async (value: string) => {
  const saltRounds = 10;
  const hashedString = await bycrpt.hash(value, saltRounds);
  return hashedString;
};

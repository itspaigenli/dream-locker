import bcrypt from "bcrypt";

const SALT_ROUNDS = 20;

export const hashPassword = async (password) => {
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    return false;
  }
  return await bcrypt.compare(password, hashedPassword);
};
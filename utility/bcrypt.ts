import * as bcrypt from 'bcrypt';

const saltRounds = 10; // You can adjust this based on your needs
// Function to hash a password
const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to compare a password with a hashed password
const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};

export { hashPassword, comparePassword}
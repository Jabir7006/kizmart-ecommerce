import 'dotenv/config';

const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const PORT = getEnv('PORT', '4000');
export const APP_ORIGIN = getEnv('APP_ORIGIN', 'http://localhost:5173');

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
export const MONGO_URI = getEnv('MONGO_URI', '');
export const NODE_ENV = getEnv('NODE_ENV', 'development');
export const ACCESS_TOKEN_SECRET = getEnv('ACCESS_TOKEN_SECRET', '');
export const REFRESH_TOKEN_SECRET = getEnv('REFRESH_TOKEN_SECRET', '');
export const SMTP_HOST = getEnv('SMTP_HOST', '');
export const SMTP_PORT = getEnv('SMTP_PORT', '');
export const SMTP_MAIL = getEnv('SMTP_MAIL', '');
export const SMTP_PASSWORD = getEnv('SMTP_PASSWORD', '');


import dotenv from 'dotenv';

dotenv.config();

export const config = {
  email: process.env.NAUKRI_EMAIL,
  password: process.env.NAUKRI_PASSWORD,
};

export function validateConfig() {
  if (!config.email || !config.password) {
    throw new Error('Please provide NAUKRI_EMAIL and NAUKRI_PASSWORD in .env file');
  }
}

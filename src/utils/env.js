import dotenv from 'dotenv';
dotenv.config();
export const env = (variable) => {
  const value = process.env[variable];

  if (!value) {
    throw new Error(`Missing environment variable: ${variable}`);
  }

  return value;
};
export const CLOUDINARY_CLOUD_NAME = env('CLOUDINARY_CLOUD_NAME');
export const CLOUDINARY_API_KEY = env('CLOUDINARY_API_KEY');
export const CLOUDINARY_API_SECRET = env('CLOUDINARY_API_SECRET');

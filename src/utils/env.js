import dotenv from 'dotenv';

dotenv.config();


export function env(name, defaultValue) {

  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;
  throw new Error(`Missing: process.env['${name}'].`);
}

export const CLOUDINARY_CLOUD_NAME = env('CLOUDINARY_CLOUD_NAME');
export const CLOUDINARY_API_KEY = env('CLOUDINARY_API_KEY');
export const CLOUDINARY_API_SECRET = env('CLOUDINARY_API_SECRET');

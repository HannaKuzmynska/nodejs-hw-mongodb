import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_DIR } from '../constants/index.js';

export const saveFileToUploadDir = async (file) => {
  const uploadPath = path.join(UPLOAD_DIR, file.filename);

  await fs.rename(file.path, uploadPath); 
  return uploadPath;
};

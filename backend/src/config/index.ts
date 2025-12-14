import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const envConfig: any = {
  ...process.env,
  CHUNK_SIZE: process.env.CHUNK_SIZE ? parseInt(process.env.CHUNK_SIZE) : 5 * 1024 * 1024,
  PER_USER_QUOTA: process.env.PER_USER_QUOTA ? parseInt(process.env.PER_USER_QUOTA) : 100 * 1024 * 1024 * 1024,
  TEMP_DIR: path.join(__dirname, "../..", "temp"),
  STORAGE_DIR: path.join(__dirname, "../..", "storage"),
  RETRIEVAL_LIMIT: process.env.RETRIEVAL_LIMIT ? parseInt(process.env.RETRIEVAL_LIMIT) : 10,
};
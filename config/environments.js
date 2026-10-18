import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

// Read target environment from ENV, defaulting to 'prod'
const envName = process.env.ENV || 'prod';
const envFileName = `.env.${envName}`;
const envFilePath = path.resolve(import.meta.dirname, envFileName);

// Load the target environment file if present on disk
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath, override: false });
}

// Validate that BASE_URL is set and non-empty
if (!process.env.BASE_URL) {
  throw new Error(
    `Missing required environment variable "BASE_URL" in config/${envFileName}`
  );
}

export const env = envName;
export const baseURL = process.env.BASE_URL;

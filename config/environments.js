import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

// Valid environment targets supported by the framework
const VALID_ENVS = ['local', 'dev', 'qa', 'staging', 'prod'];

// Read target environment from ENV, defaulting to 'prod'
const envName = process.env.ENV || 'prod';
if (!VALID_ENVS.includes(envName)) {
  throw new Error(`Invalid ENV "${envName}". Allowed values: ${VALID_ENVS.join(', ')}`);
}

const envFileName = `.env.${envName}`;
const envFilePath = path.resolve(import.meta.dirname, envFileName);

// Load the target environment file if present on disk
// override: false ensures that variables already set in the shell or CI win over file values
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath, override: false });
}

// Required configuration keys that must be set and non-empty
// Fails fast and lists all missing keys together
const REQUIRED_KEYS = ['BASE_URL'];
const missingKeys = REQUIRED_KEYS.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  throw new Error(
    `Missing required environment variable(s) [${missingKeys.join(', ')}] in config/${envFileName}`
  );
}

export const env = envName;
export const baseURL = process.env.BASE_URL;

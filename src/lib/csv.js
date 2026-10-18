import fs from 'node:fs/promises';

/**
 * Parses a single CSV line into an array of string tokens, respecting quotes and escaped quotes.
 * @param {string} line
 * @returns {string[]}
 */
export function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          // Escaped quote: "" -> "
          current += '"';
          i += 2;
          continue;
        } else {
          // Closing quote
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        current += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        // Opening quote
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        fields.push(current.trim());
        current = '';
        i++;
        continue;
      } else {
        current += char;
        i++;
        continue;
      }
    }
  }

  fields.push(current.trim());
  return fields;
}

/**
 * Parses full CSV text into an array of row objects mapped by header names.
 * @param {string} text
 * @returns {Array<Record<string, string>>}
 */
export function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? '';
    });
    rows.push(row);
  }

  return rows;
}

/**
 * Reads and parses a CSV file from disk.
 * @param {string} filePath
 * @returns {Promise<Array<Record<string, string>>>}
 */
export async function readCsv(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return parseCsv(content);
}

/**
 * Formats and writes an array of objects to a CSV file.
 * Handles quoting fields containing commas, quotes, or newlines.
 * @param {string} filePath
 * @param {Array<Record<string, any>>} rows
 * @returns {Promise<void>}
 */
export async function writeCsv(filePath, rows) {
  if (rows.length === 0) {
    await fs.writeFile(filePath, '', 'utf-8');
    return;
  }

  const headers = Object.keys(rows[0]);
  const formatField = (val) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const headerLine = headers.map(formatField).join(',');
  const dataLines = rows.map((row) => headers.map((h) => formatField(row[h])).join(','));
  const content = [headerLine, ...dataLines].join('\n') + '\n';

  await fs.writeFile(filePath, content, 'utf-8');
}

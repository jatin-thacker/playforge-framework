import ExcelJS from 'exceljs/dist/exceljs.min.js';
import fs from 'node:fs/promises';

/**
 * Reads an Excel workbook and returns rows as an array of objects
 * where object keys correspond to the header row (first row).
 * Uses buffer loading to avoid Node/browser runtime fs conflicts.
 *
 * @param {string} filePath
 * @param {string|number} [sheetNameOrIndex=1]
 * @returns {Promise<Array<Record<string, any>>>}
 */
export async function readExcel(filePath, sheetNameOrIndex = 1) {
  const buffer = await fs.readFile(filePath);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet =
    typeof sheetNameOrIndex === 'string'
      ? workbook.getWorksheet(sheetNameOrIndex)
      : workbook.getWorksheet(sheetNameOrIndex);

  if (!worksheet) {
    throw new Error(`Worksheet "${sheetNameOrIndex}" not found in ${filePath}`);
  }

  const rows = [];
  let headers = [];

  worksheet.eachRow((row, rowNumber) => {
    // Treat first row as column headers
    if (rowNumber === 1) {
      headers = row.values.slice(1).map((val) => String(val ?? '').trim());
    } else {
      const rowData = {};
      const values = row.values.slice(1);
      headers.forEach((header, index) => {
        if (header) {
          const cellVal = values[index];
          rowData[header] = cellVal !== undefined && cellVal !== null ? String(cellVal).trim() : '';
        }
      });
      rows.push(rowData);
    }
  });

  return rows;
}

/**
 * Writes an array of objects to an Excel workbook file.
 * Uses writeBuffer to avoid Node/browser runtime fs conflicts.
 *
 * @param {string} filePath
 * @param {string} sheetName
 * @param {Array<Record<string, any>>} rows
 * @returns {Promise<void>}
 */
export async function writeExcel(filePath, sheetName, rows) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  if (rows.length > 0) {
    const headers = Object.keys(rows[0]);
    worksheet.columns = headers.map((header) => ({ header, key: header }));
    for (const row of rows) {
      worksheet.addRow(row);
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  await fs.writeFile(filePath, Buffer.from(buffer));
}

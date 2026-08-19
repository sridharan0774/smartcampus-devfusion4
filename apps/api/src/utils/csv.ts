import * as XLSX from 'xlsx';

export const generateExcelBuffer = (data: any[], sheetName: string = 'Report'): Buffer => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

export const generateCSVBuffer = (data: any[]): Buffer => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvString = XLSX.utils.sheet_to_csv(worksheet);
  return Buffer.from(csvString, 'utf-8');
};

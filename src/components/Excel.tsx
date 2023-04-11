// import { utils, writeFileXLSX } from 'xlsx';

// export const handleDownloadExcel = (dataSource:any,sheetName:string,fileName:string) => {
//     const ws = utils.json_to_sheet(dataSource);
//     const wb = utils.book_new();
//     utils.book_append_sheet(wb, ws, sheetName);
//     writeFileXLSX(wb, `${fileName}.xlsx`);        
// };

import * as XLSX from 'xlsx';

const { utils, writeFile } = XLSX;

export const handleDownloadExcel = (dataSource, sheetName, fileName) => {
  const ws = utils.json_to_sheet(dataSource);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, sheetName);
  writeFile(wb, `${fileName}.xlsx`);
};

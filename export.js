const ExcelJS = require('exceljs');

export async function generateExcelReport(processedRecords) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance Sheet');

  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'First In Time', key: 'firstInTime', width: 20 },
    { header: 'Last Out Time', key: 'lastOutTime', width: 20 },
    { header: 'Total Work Duration (hours)', key: 'totalWorkDuration', width: 25 },
    { header: 'Total Break Duration (minutes)', key: 'totalBreakDuration', width: 25 }
  ];

  // Added some random styling, no time to dive here now
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFFFF' },
    bgColor: { argb: 'FF0000FF' }
  };

  processedRecords.forEach(record => {
    worksheet.addRow({
      ...record,
      totalWorkDuration: record.totalWorkDuration / (1000 * 60 * 60),
      totalBreakDuration: record.totalBreakDuration / (1000 * 60)
    });
  });

  const fileName = `Attendance_Report_${new Date().toISOString()}.xlsx`;
  await workbook.xlsx.writeFile(fileName);

  return fileName;
}

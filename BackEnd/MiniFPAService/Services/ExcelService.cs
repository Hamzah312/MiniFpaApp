using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using ClosedXML.Excel;
using MiniFPAService.DTOs;

namespace MiniFPAService.Services
{
    public class ExcelService : IExcelService
    {
        public async Task<List<FinancialRecordDto>> ParseExcelAsync(Stream fileStream)
        {
            var records = new List<FinancialRecordDto>();
            using (var workbook = new XLWorkbook(fileStream))
            {
                var worksheet = workbook.Worksheets.Worksheet(1);
                var rows = worksheet.RowsUsed();
                foreach (var row in rows.Skip(1)) // Skip header
                {
                    var record = new FinancialRecordDto
                    {
                        Type = row.Cell(1).GetString(),
                        Account = row.Cell(2).GetString(),
                        Department = row.Cell(3).GetString(),
                        Year = int.Parse(row.Cell(4).GetString()),
                        Month = int.Parse(row.Cell(5).GetString()),
                        Amount = decimal.Parse(row.Cell(6).GetString())
                    };
                    records.Add(record);
                }
            }
            return await Task.FromResult(records);
        }
    }
}


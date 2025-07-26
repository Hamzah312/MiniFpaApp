using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using MiniFPAService.DTOs;

namespace MiniFPAService.Services
{
    public interface IExcelService
    {
        Task<List<FinancialRecordDto>> ParseExcelAsync(Stream fileStream);
    }
}


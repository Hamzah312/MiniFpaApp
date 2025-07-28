using System.Collections.Generic;
using System.Threading.Tasks;
using MiniFPAService.Models;
using MiniFPAService.DTOs;

namespace MiniFPAService.Services
{
    public interface IFinancialRecordService
    {
        Task AddRecordsAsync(List<FinancialRecord> records);
        Task<List<FinancialRecord>> GetAllAsync();
        Task<List<FinancialRecord>> GetByTypeAsync(string type);
        Task<List<FinancialRecordDto>> GetAllDtosAsync();
        
        // FEATURE 1: Versioned Scenario Engine
        Task<List<FinancialRecord>> GetByScenarioAsync(string scenario);
        Task<List<FinancialRecord>> GetLatestByScenarioAsync(string scenario);
        
        // FEATURE 2: What-If Scenario Cloning + Adjustments
        Task<string> CloneScenarioAsync(ScenarioCloneRequestDto request);
        
        // FEATURE 4: Drill-Down Reporting
        Task<List<FinancialRecord>> GetDrilldownAsync(string scenario, string account, DateTime? fromDate = null, DateTime? toDate = null, string? department = null);
        
        // Enhanced upload with scenario and version
        Task ProcessExcelUploadAsync(List<FinancialRecordDto> dtos, string scenario, string version, string userName = "System");
        
        // FEATURE 1: AUDIT TRAIL
        Task<List<ChangeHistory>> GetRecordAuditTrailAsync(int recordId);
        
        // FEATURE 2: SCENARIO COMPARISON
        Task<List<ScenarioComparisonDto>> CompareScenarios(string baseScenario, string targetScenario, DateTime? fromDate = null, DateTime? toDate = null, bool includeDepartment = false);
    }
}

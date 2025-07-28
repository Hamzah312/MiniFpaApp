using MiniFPAService.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace MiniFPAService.Repositories
{
    public interface IFinancialRecordRepository
    {
        Task AddRecordsAsync(IEnumerable<FinancialRecord> records);
        Task<List<FinancialRecord>> GetAllAsync();
        Task<List<FinancialRecord>> GetByTypeAsync(string type);
        
        // FEATURE 1: Versioned Scenario Engine
        Task<List<FinancialRecord>> GetByScenarioAsync(string scenario);
        Task<List<FinancialRecord>> GetLatestByScenarioAsync(string scenario);
        
        // FEATURE 2: What-If Scenario Cloning
        Task<List<FinancialRecord>> GetByScenarioAndVersionAsync(string scenario, string version);
        
        // FEATURE 4: Drill-Down Reporting
        Task<List<FinancialRecord>> GetDrilldownAsync(string scenario, string account, DateTime? fromDate = null, DateTime? toDate = null, string? department = null);
        
        // FEATURE 3: Lookup Tables
        Task<FXRate> GetFXRateAsync(string fromCurrency, string toCurrency, string period);
        Task<AccountMap> GetAccountMapAsync(string accountCode);
        Task AddFXRatesAsync(IEnumerable<FXRate> fxRates);
        Task AddAccountMapsAsync(IEnumerable<AccountMap> accountMaps);
        
        // FEATURE 1: AUDIT TRAIL
        Task AddChangeHistoryAsync(ChangeHistory changeHistory);
        Task<List<ChangeHistory>> GetChangeHistoryByRecordIdAsync(int recordId);
        Task<FinancialRecord> GetRecordWithHistoryAsync(int recordId);
        
        // FEATURE 2: SCENARIO COMPARISON
        Task<List<FinancialRecord>> GetByScenarioAndDateRangeAsync(string scenario, DateTime? fromDate = null, DateTime? toDate = null);
        
        // DROPDOWN FILTERS
        Task<List<string>> GetUniqueScenariosAsync();
        Task<List<string>> GetUniqueAccountsAsync();
        Task<List<string>> GetUniqueDepartmentsAsync();
    }
}


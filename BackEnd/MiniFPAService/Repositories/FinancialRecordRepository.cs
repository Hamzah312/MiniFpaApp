using MiniFPAService.Data;
using MiniFPAService.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace MiniFPAService.Repositories
{
    public class FinancialRecordRepository : IFinancialRecordRepository
    {
        private readonly ApplicationDbContext _context;

        public FinancialRecordRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddRecordsAsync(IEnumerable<FinancialRecord> records)
        {
            await _context.FinancialRecords.AddRangeAsync(records);
            await _context.SaveChangesAsync();
        }

        public async Task<List<FinancialRecord>> GetAllAsync()
        {
            return await _context.FinancialRecords.ToListAsync();
        }

        public async Task<List<FinancialRecord>> GetByTypeAsync(string type)
        {
            return await _context.FinancialRecords
                .Where(r => r.Type == type)
                .ToListAsync();
        }

        // FEATURE 1: Versioned Scenario Engine
        public async Task<List<FinancialRecord>> GetByScenarioAsync(string scenario)
        {
            return await _context.FinancialRecords
                .Where(r => r.Scenario == scenario)
                .ToListAsync();
        }

        public async Task<List<FinancialRecord>> GetLatestByScenarioAsync(string scenario)
        {
            var latestTimestamp = await _context.FinancialRecords
                .Where(r => r.Scenario == scenario)
                .MaxAsync(r => r.UploadTimestamp);

            return await _context.FinancialRecords
                .Where(r => r.Scenario == scenario && r.UploadTimestamp == latestTimestamp)
                .ToListAsync();
        }

        // FEATURE 2: What-If Scenario Cloning
        public async Task<List<FinancialRecord>> GetByScenarioAndVersionAsync(string scenario, string version)
        {
            return await _context.FinancialRecords
                .Where(r => r.Scenario == scenario && r.Version == version)
                .ToListAsync();
        }

        // FEATURE 4: Drill-Down Reporting
        public async Task<List<FinancialRecord>> GetDrilldownAsync(string scenario, string account, DateTime? fromDate = null, DateTime? toDate = null, string? department = null)
        {
            var query = _context.FinancialRecords
                .Where(r => r.Scenario == scenario && r.Account == account);

            // Apply date range filter
            if (fromDate.HasValue)
            {
                query = query.Where(r => r.Year > fromDate.Value.Year || 
                                        (r.Year == fromDate.Value.Year && r.Month >= fromDate.Value.Month));
            }

            if (toDate.HasValue)
            {
                query = query.Where(r => r.Year < toDate.Value.Year || 
                                        (r.Year == toDate.Value.Year && r.Month <= toDate.Value.Month));
            }

            if (!string.IsNullOrEmpty(department))
            {
                query = query.Where(r => r.Department == department);
            }

            return await query.ToListAsync();
        }

        // FEATURE 3: Lookup Tables
        public async Task<FXRate> GetFXRateAsync(string fromCurrency, string toCurrency, string period)
        {
            return await _context.FXRates
                .FirstOrDefaultAsync(fx => fx.FromCurrency == fromCurrency && 
                                          fx.ToCurrency == toCurrency && 
                                          fx.Period == period);
        }

        public async Task<AccountMap> GetAccountMapAsync(string accountCode)
        {
            return await _context.AccountMaps
                .FirstOrDefaultAsync(am => am.AccountCode == accountCode);
        }

        public async Task AddFXRatesAsync(IEnumerable<FXRate> fxRates)
        {
            await _context.FXRates.AddRangeAsync(fxRates);
            await _context.SaveChangesAsync();
        }

        public async Task AddAccountMapsAsync(IEnumerable<AccountMap> accountMaps)
        {
            await _context.AccountMaps.AddRangeAsync(accountMaps);
            await _context.SaveChangesAsync();
        }

        // FEATURE 1: AUDIT TRAIL
        public async Task AddChangeHistoryAsync(ChangeHistory changeHistory)
        {
            await _context.ChangeHistories.AddAsync(changeHistory);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ChangeHistory>> GetChangeHistoryByRecordIdAsync(int recordId)
        {
            return await _context.ChangeHistories
                .Where(ch => ch.RecordId == recordId)
                .OrderByDescending(ch => ch.Timestamp)
                .ToListAsync();
        }

        public async Task<FinancialRecord> GetRecordWithHistoryAsync(int recordId)
        {
            return await _context.FinancialRecords
                .Include(fr => fr.ChangeHistory)
                .FirstOrDefaultAsync(fr => fr.Id == recordId);
        }

        // FEATURE 2: SCENARIO COMPARISON
        public async Task<List<FinancialRecord>> GetByScenarioAndDateRangeAsync(string scenario, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _context.FinancialRecords
                .Where(r => r.Scenario == scenario);

            // Apply date range filter
            if (fromDate.HasValue)
            {
                query = query.Where(r => r.Year > fromDate.Value.Year || 
                                        (r.Year == fromDate.Value.Year && r.Month >= fromDate.Value.Month));
            }

            if (toDate.HasValue)
            {
                query = query.Where(r => r.Year < toDate.Value.Year || 
                                        (r.Year == toDate.Value.Year && r.Month <= toDate.Value.Month));
            }

            return await query.ToListAsync();
        }

        // DROPDOWN FILTERS
        public async Task<List<string>> GetUniqueScenariosAsync()
        {
            return await _context.FinancialRecords
                .Select(r => r.Scenario)
                .Distinct()
                .Where(s => !string.IsNullOrEmpty(s))
                .OrderBy(s => s)
                .ToListAsync();
        }

        public async Task<List<string>> GetUniqueAccountsAsync()
        {
            return await _context.FinancialRecords
                .Select(r => r.Account)
                .Distinct()
                .Where(a => !string.IsNullOrEmpty(a))
                .OrderBy(a => a)
                .ToListAsync();
        }

        public async Task<List<string>> GetUniqueDepartmentsAsync()
        {
            return await _context.FinancialRecords
                .Select(r => r.Department)
                .Distinct()
                .Where(d => !string.IsNullOrEmpty(d))
                .OrderBy(d => d)
                .ToListAsync();
        }
    }
}


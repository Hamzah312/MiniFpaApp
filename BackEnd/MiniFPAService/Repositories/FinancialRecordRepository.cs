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
        public async Task<List<FinancialRecord>> GetDrilldownAsync(string scenario, string account, string period, string department = null)
        {
            var query = _context.FinancialRecords
                .Where(r => r.Scenario == scenario && r.Account == account);

            // Parse period (e.g., "2024-01")
            if (!string.IsNullOrEmpty(period) && period.Contains("-"))
            {
                var parts = period.Split('-');
                if (parts.Length == 2 && int.TryParse(parts[0], out int year) && int.TryParse(parts[1], out int month))
                {
                    query = query.Where(r => r.Year == year && r.Month == month);
                }
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
        public async Task<List<FinancialRecord>> GetByScenarioAndPeriodAsync(string scenario, string period)
        {
            var query = _context.FinancialRecords
                .Where(r => r.Scenario == scenario);

            // Parse period (e.g., "2024-07")
            if (!string.IsNullOrEmpty(period) && period.Contains("-"))
            {
                var parts = period.Split('-');
                if (parts.Length == 2 && int.TryParse(parts[0], out int year) && int.TryParse(parts[1], out int month))
                {
                    query = query.Where(r => r.Year == year && r.Month == month);
                }
            }

            return await query.ToListAsync();
        }
    }
}


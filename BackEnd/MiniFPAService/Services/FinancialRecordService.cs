using System.Collections.Generic;
using System.Threading.Tasks;
using MiniFPAService.Models;
using MiniFPAService.DTOs;
using MiniFPAService.Repositories;
using System.Linq;
using System;

namespace MiniFPAService.Services
{
    public class FinancialRecordService : IFinancialRecordService
    {
        private readonly IFinancialRecordRepository _repository;

        public FinancialRecordService(IFinancialRecordRepository repository)
        {
            _repository = repository;
        }

        public async Task AddRecordsAsync(List<FinancialRecord> records)
        {
            await _repository.AddRecordsAsync(records);
        }

        public async Task<List<FinancialRecord>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<List<FinancialRecord>> GetByTypeAsync(string type)
        {
            return await _repository.GetByTypeAsync(type);
        }

        public async Task<List<FinancialRecordDto>> GetAllDtosAsync()
        {
            var records = await _repository.GetAllAsync();
            return records.Select(r => new FinancialRecordDto
            {
                Type = r.Type,
                Account = r.Account,
                Department = r.Department,
                Year = r.Year,
                Month = r.Month,
                Amount = r.Amount,
                Scenario = r.Scenario,
                Version = r.Version,
                UploadTimestamp = r.UploadTimestamp
            }).ToList();
        }

        // FEATURE 1: Versioned Scenario Engine
        public async Task<List<FinancialRecord>> GetByScenarioAsync(string scenario)
        {
            return await _repository.GetByScenarioAsync(scenario);
        }

        public async Task<List<FinancialRecord>> GetLatestByScenarioAsync(string scenario)
        {
            return await _repository.GetLatestByScenarioAsync(scenario);
        }

        // FEATURE 2: What-If Scenario Cloning + Adjustments
        public async Task<string> CloneScenarioAsync(ScenarioCloneRequestDto request)
        {
            // Get base scenario data
            var baseRecords = await _repository.GetByScenarioAsync(request.BaseScenario);
            if (!baseRecords.Any())
            {
                throw new ArgumentException($"No records found for base scenario: {request.BaseScenario}");
            }

            // Create new version for cloned scenario
            var newVersion = DateTime.UtcNow.ToString("yyyy-MM-dd-HHmmss");
            var uploadTimestamp = DateTime.UtcNow;

            // Clone and apply adjustments
            var clonedRecords = new List<FinancialRecord>();
            foreach (var record in baseRecords)
            {
                var clonedRecord = new FinancialRecord
                {
                    Type = record.Type,
                    Account = record.Account,
                    Department = record.Department,
                    Year = record.Year,
                    Month = record.Month,
                    Amount = record.Amount,
                    Scenario = request.NewScenario,
                    Version = newVersion,
                    UploadTimestamp = uploadTimestamp
                };

                // Apply adjustments
                foreach (var adjustment in request.Adjustments)
                {
                    if ((!string.IsNullOrEmpty(adjustment.Account) && record.Account == adjustment.Account) ||
                        (!string.IsNullOrEmpty(adjustment.Department) && record.Department == adjustment.Department))
                    {
                        clonedRecord.Amount *= adjustment.Factor;
                    }
                }

                clonedRecords.Add(clonedRecord);
            }

            await _repository.AddRecordsAsync(clonedRecords);

            // FEATURE 1: AUDIT TRAIL - Create change history for cloned records
            foreach (var record in clonedRecords)
            {
                var changeHistory = new ChangeHistory
                {
                    Id = Guid.NewGuid(),
                    RecordId = record.Id,
                    Action = "Cloned",
                    UserName = "System", // TODO: Get from current user context
                    Timestamp = uploadTimestamp
                };
                await _repository.AddChangeHistoryAsync(changeHistory);
            }

            return newVersion;
        }

        // FEATURE 4: Drill-Down Reporting
        public async Task<List<FinancialRecord>> GetDrilldownAsync(string scenario, string account, DateTime? fromDate = null, DateTime? toDate = null, string? department = null)
        {
            return await _repository.GetDrilldownAsync(scenario, account, fromDate, toDate, department);
        }

        // Enhanced upload with scenario and version
        public async Task ProcessExcelUploadAsync(List<FinancialRecordDto> dtos, string scenario, string version, string userName = "System")
        {
            var uploadTimestamp = DateTime.UtcNow;
            var records = new List<FinancialRecord>();

            foreach (var dto in dtos)
            {
                var record = new FinancialRecord
                {
                    Type = dto.Type,
                    Account = await ApplyAccountMappingAsync(dto.Account),
                    Department = dto.Department,
                    Year = dto.Year,
                    Month = dto.Month,
                    Amount = await ApplyFXConversionAsync(dto.Amount, dto.Year, dto.Month),
                    Scenario = scenario,
                    Version = version,
                    UploadTimestamp = uploadTimestamp
                };

                records.Add(record);
            }

            await _repository.AddRecordsAsync(records);

            // FEATURE 1: AUDIT TRAIL - Create change history for imported records
            foreach (var record in records)
            {
                var changeHistory = new ChangeHistory
                {
                    Id = Guid.NewGuid(),
                    RecordId = record.Id,
                    Action = "Imported",
                    UserName = userName,
                    Timestamp = uploadTimestamp
                };

                await _repository.AddChangeHistoryAsync(changeHistory);
            }
        }


        // FEATURE 1: AUDIT TRAIL
        public async Task<List<ChangeHistory>> GetRecordAuditTrailAsync(int recordId)
        {
            return await _repository.GetChangeHistoryByRecordIdAsync(recordId);
        }

        // FEATURE 2: SCENARIO COMPARISON
        public async Task<List<ScenarioComparisonDto>> CompareScenarios(string baseScenario, string targetScenario, DateTime? fromDate = null, DateTime? toDate = null, bool includeDepartment = false)
        {
            var baseRecords = await _repository.GetByScenarioAndDateRangeAsync(baseScenario, fromDate, toDate);
            var targetRecords = await _repository.GetByScenarioAndDateRangeAsync(targetScenario, fromDate, toDate);

            var comparison = new List<ScenarioComparisonDto>();

            if (includeDepartment)
            {
                // Group by both Account and Department
                var baseGroups = baseRecords.GroupBy(r => new { r.Account, r.Department }).ToDictionary(g => g.Key, g => g.Sum(r => r.Amount));
                var targetGroups = targetRecords.GroupBy(r => new { r.Account, r.Department }).ToDictionary(g => g.Key, g => g.Sum(r => r.Amount));
                var allKeys = baseGroups.Keys.Union(targetGroups.Keys).ToList();

                foreach (var key in allKeys)
                {
                    var baseAmount = baseGroups.GetValueOrDefault(key, 0);
                    var targetAmount = targetGroups.GetValueOrDefault(key, 0);
                    var delta = targetAmount - baseAmount;
                    var percentage = baseAmount != 0 ? (delta / baseAmount) * 100 : 0;

                    comparison.Add(new ScenarioComparisonDto
                    {
                        Account = key.Account,
                        Department = key.Department,
                        BaseAmount = baseAmount,
                        TargetAmount = targetAmount,
                        Delta = delta,
                        Percentage = Math.Round(percentage, 2)
                    });
                }
            }
            else
            {
                // Group by Account only
                var baseGroups = baseRecords.GroupBy(r => r.Account).ToDictionary(g => g.Key, g => g.Sum(r => r.Amount));
                var targetGroups = targetRecords.GroupBy(r => r.Account).ToDictionary(g => g.Key, g => g.Sum(r => r.Amount));
                var allKeys = baseGroups.Keys.Union(targetGroups.Keys).ToList();

                foreach (var account in allKeys)
                {
                    var baseAmount = baseGroups.GetValueOrDefault(account, 0);
                    var targetAmount = targetGroups.GetValueOrDefault(account, 0);
                    var delta = targetAmount - baseAmount;
                    var percentage = baseAmount != 0 ? (delta / baseAmount) * 100 : 0;

                    comparison.Add(new ScenarioComparisonDto
                    {
                        Account = account,
                        Department = null,
                        BaseAmount = baseAmount,
                        TargetAmount = targetAmount,
                        Delta = delta,
                        Percentage = Math.Round(percentage, 2)
                    });
                }
            }

            return comparison.OrderBy(c => c.Account).ThenBy(c => c.Department).ToList();
        }

        // FEATURE 3: Helper methods for FX conversion and account mapping
        private async Task<string> ApplyAccountMappingAsync(string accountCode)
        {
            var accountMap = await _repository.GetAccountMapAsync(accountCode);
            return accountMap?.AccountName ?? accountCode;
        }

        private async Task<decimal> ApplyFXConversionAsync(decimal amount, int year, int month)
        {
            var period = $"{year:D4}-{month:D2}";
            var fxRate = await _repository.GetFXRateAsync("EUR", "USD", period); // Assuming EUR as default source
            
            if (fxRate != null)
            {
                return amount * fxRate.Rate;
            }
            
            return amount; // Return original amount if no FX rate found
        }
    }
}

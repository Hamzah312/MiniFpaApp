using Microsoft.EntityFrameworkCore;
using MiniFPAService.Models;

namespace MiniFPAService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<FinancialRecord> FinancialRecords { get; set; }
        
        // FEATURE 3: Lookup Tables
        public DbSet<FXRate> FXRates { get; set; }
        public DbSet<AccountMap> AccountMaps { get; set; }
        
        // FEATURE 1: AUDIT TRAIL
        public DbSet<ChangeHistory> ChangeHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure relationship between FinancialRecord and ChangeHistory
            modelBuilder.Entity<ChangeHistory>()
                .HasOne(ch => ch.FinancialRecord)
                .WithMany(fr => fr.ChangeHistory)
                .HasForeignKey(ch => ch.RecordId);

            base.OnModelCreating(modelBuilder);
        }

        public void SeedData()
        {
            // Check if data already exists
            if (FinancialRecords.Any() || FXRates.Any() || AccountMaps.Any())
                return;

            // Seed Account Maps
            var accountMaps = new List<AccountMap>
            {
                new AccountMap { AccountCode = "1000", AccountName = "Cash and Cash Equivalents" },
                new AccountMap { AccountCode = "1100", AccountName = "Accounts Receivable" },
                new AccountMap { AccountCode = "1200", AccountName = "Inventory" },
                new AccountMap { AccountCode = "2000", AccountName = "Accounts Payable" },
                new AccountMap { AccountCode = "2100", AccountName = "Accrued Liabilities" },
                new AccountMap { AccountCode = "4000", AccountName = "Sales Revenue" },
                new AccountMap { AccountCode = "5000", AccountName = "Cost of Goods Sold" },
                new AccountMap { AccountCode = "6000", AccountName = "Operating Expenses" },
                new AccountMap { AccountCode = "6100", AccountName = "Marketing Expenses" },
                new AccountMap { AccountCode = "6200", AccountName = "Administrative Expenses" }
            };
            AccountMaps.AddRange(accountMaps);

            // Seed FX Rates
            var fxRates = new List<FXRate>
            {
                new FXRate { FromCurrency = "USD", ToCurrency = "EUR", Rate = 0.85m, Period = "2024-12" },
                new FXRate { FromCurrency = "USD", ToCurrency = "GBP", Rate = 0.75m, Period = "2024-12" },
                new FXRate { FromCurrency = "USD", ToCurrency = "JPY", Rate = 110.50m, Period = "2024-12" },
                new FXRate { FromCurrency = "EUR", ToCurrency = "USD", Rate = 1.18m, Period = "2024-12" },
                new FXRate { FromCurrency = "GBP", ToCurrency = "USD", Rate = 1.33m, Period = "2024-12" },
                new FXRate { FromCurrency = "USD", ToCurrency = "EUR", Rate = 0.84m, Period = "2024-11" },
                new FXRate { FromCurrency = "USD", ToCurrency = "GBP", Rate = 0.76m, Period = "2024-11" }
            };
            FXRates.AddRange(fxRates);

            // Seed Financial Records
            var scenarios = new[] { "Actual", "Forecast", "Budget" };
            var departments = new[] { "Sales", "Marketing", "Operations", "Finance", "HR" };
            var accounts = new[] { "4000", "5000", "6000", "6100", "6200", "1000", "1100", "2000" };
            var types = new[] { "Revenue", "Expense", "Asset", "Liability" };

            var financialRecords = new List<FinancialRecord>();
            var random = new Random(42); // Fixed seed for consistent demo data

            foreach (var scenario in scenarios)
            {
                for (int year = 2023; year <= 2024; year++)
                {
                    for (int month = 1; month <= 12; month++)
                    {
                        foreach (var department in departments)
                        {
                            for (int i = 0; i < 2; i++) // 2 records per department per month per scenario
                            {
                                var account = accounts[random.Next(accounts.Length)];
                                var type = account.StartsWith("4") ? "Revenue" : 
                                         account.StartsWith("5") || account.StartsWith("6") ? "Expense" :
                                         account.StartsWith("1") ? "Asset" : "Liability";

                                var baseAmount = type == "Revenue" ? random.Next(50000, 200000) :
                                               type == "Expense" ? random.Next(10000, 50000) :
                                               random.Next(5000, 100000);

                                // Add scenario variance
                                var variance = scenario == "Actual" ? 1.0 : 
                                             scenario == "Forecast" ? random.NextDouble() * 0.2 + 0.9 :
                                             random.NextDouble() * 0.3 + 0.85;

                                financialRecords.Add(new FinancialRecord
                                {
                                    Type = type,
                                    Account = account,
                                    Department = department,
                                    Year = year,
                                    Month = month,
                                    Amount = (decimal)(baseAmount * variance * (random.NextDouble() * 0.2 + 0.9)),
                                    Scenario = scenario,
                                    Version = "v1.0",
                                    UploadTimestamp = DateTime.Now.AddDays(-random.Next(1, 30))
                                });
                            }
                        }
                    }
                }
            }

            FinancialRecords.AddRange(financialRecords);
            SaveChanges();
        }
    }
}



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
    }
}



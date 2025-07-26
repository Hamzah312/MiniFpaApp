using System;
using System.ComponentModel.DataAnnotations;

namespace MiniFPAService.Models
{
    // FEATURE 1: AUDIT TRAIL
    public class ChangeHistory
    {
        [Key]
        public Guid Id { get; set; }
        public int RecordId { get; set; }
        public string Action { get; set; } // "Imported", "Adjusted", "Cloned", etc.
        public string UserName { get; set; }
        public DateTime Timestamp { get; set; }
        
        // Navigation property
        public FinancialRecord FinancialRecord { get; set; }
    }
}

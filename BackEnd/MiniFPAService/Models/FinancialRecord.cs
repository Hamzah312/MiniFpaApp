using System;
using System.Collections.Generic;

namespace MiniFPAService.Models
{
    public class FinancialRecord
    {
        public int Id { get; set; }
        public string Type { get; set; } // e.g. Budget, Actuals
        public string Account { get; set; }
        public string Department { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal Amount { get; set; }
        
        // FEATURE 1: Versioned Scenario Engine
        public string Scenario { get; set; } // e.g. "Budget", "Actual"
        public string Version { get; set; } // e.g. "v1", "Final", "2024-07-01"
        public DateTime UploadTimestamp { get; set; }
        
        // FEATURE 1: AUDIT TRAIL - Navigation property
        public List<ChangeHistory> ChangeHistory { get; set; } = new List<ChangeHistory>();
    }
}


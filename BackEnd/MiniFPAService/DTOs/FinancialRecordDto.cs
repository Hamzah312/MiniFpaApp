using System;

namespace MiniFPAService.DTOs
{
    public class FinancialRecordDto
    {
        public string Type { get; set; }
        public string Account { get; set; }
        public string Department { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal Amount { get; set; }
        
        // FEATURE 1: Versioned Scenario Engine
        public string Scenario { get; set; }
        public string Version { get; set; }
        public DateTime? UploadTimestamp { get; set; }
    }
}


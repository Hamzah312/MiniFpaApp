using System;

namespace MiniFPAService.Models
{
    // FEATURE 3: Lookup Tables
    public class FXRate
    {
        public int Id { get; set; }
        public string FromCurrency { get; set; }
        public string ToCurrency { get; set; }
        public decimal Rate { get; set; }
        public string Period { get; set; } // e.g. "2024-01"
    }
}

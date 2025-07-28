using System.Collections.Generic;

namespace MiniFPAService.DTOs
{
    // FEATURE 2: SCENARIO COMPARISON
    public class ScenarioComparisonDto
    {
        public required string Account { get; set; }
        public string? Department { get; set; }
        public decimal BaseAmount { get; set; }
        public decimal TargetAmount { get; set; }
        public decimal Delta { get; set; }
        public decimal Percentage { get; set; }
    }

    public class ScenarioComparisonRequestDto
    {
        public required string BaseScenario { get; set; }
        public required string TargetScenario { get; set; }
        public required string Period { get; set; }
        public bool IncludeDepartment { get; set; } = false;
    }
}

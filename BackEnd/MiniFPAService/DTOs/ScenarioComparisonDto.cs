using System.Collections.Generic;

namespace MiniFPAService.DTOs
{
    // FEATURE 2: SCENARIO COMPARISON
    public class ScenarioComparisonDto
    {
        public string Account { get; set; }
        public string Department { get; set; }
        public decimal BaseAmount { get; set; }
        public decimal TargetAmount { get; set; }
        public decimal Delta { get; set; }
        public decimal Percentage { get; set; }
    }

    public class ScenarioComparisonRequestDto
    {
        public string BaseScenario { get; set; }
        public string TargetScenario { get; set; }
        public string Period { get; set; }
        public bool IncludeDepartment { get; set; } = false;
    }
}

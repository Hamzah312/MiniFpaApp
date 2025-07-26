using System.Collections.Generic;

namespace MiniFPAService.DTOs
{
    // FEATURE 2: What-If Scenario Cloning + Adjustments
    public class ScenarioCloneRequestDto
    {
        public string BaseScenario { get; set; }
        public string NewScenario { get; set; }
        public List<AdjustmentDto> Adjustments { get; set; } = new List<AdjustmentDto>();
    }

    public class AdjustmentDto
    {
        public string Account { get; set; }
        public string Department { get; set; }
        public decimal Factor { get; set; }
    }
}

using Microsoft.AspNetCore.Mvc;
using MiniFPAService.DTOs;
using MiniFPAService.Services;
using System.Threading.Tasks;

namespace MiniFPAService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScenariosController : ControllerBase
    {
        private readonly IFinancialRecordService _service;

        public ScenariosController(IFinancialRecordService service)
        {
            _service = service;
        }

        // FEATURE 2: What-If Scenario Cloning + Adjustments
        [HttpPost("clone")]
        public async Task<IActionResult> CloneScenario([FromBody] ScenarioCloneRequestDto request)
        {
            if (string.IsNullOrEmpty(request.BaseScenario) || string.IsNullOrEmpty(request.NewScenario))
            {
                return BadRequest("BaseScenario and NewScenario are required.");
            }

            try
            {
                var newVersion = await _service.CloneScenarioAsync(request);
                return Ok(new { 
                    Message = $"Scenario '{request.NewScenario}' created successfully from '{request.BaseScenario}'",
                    NewScenario = request.NewScenario,
                    Version = newVersion
                });
            }
            catch (System.ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

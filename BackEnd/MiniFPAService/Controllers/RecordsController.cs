using Microsoft.AspNetCore.Mvc;
using MiniFPAService.Services;
using MiniFPAService.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace MiniFPAService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecordsController : ControllerBase
    {
        private readonly IFinancialRecordService _service;

        public RecordsController(IFinancialRecordService service)
        {
            _service = service;
        }

        // FEATURE 1: AUDIT TRAIL
        [HttpGet("{recordId}/audit")]
        public async Task<ActionResult<List<ChangeHistory>>> GetRecordAuditTrail(int recordId)
        {
            var auditTrail = await _service.GetRecordAuditTrailAsync(recordId);
            if (auditTrail == null || auditTrail.Count == 0)
            {
                return NotFound($"No audit trail found for record ID: {recordId}");
            }

            return Ok(auditTrail);
        }
    }
}

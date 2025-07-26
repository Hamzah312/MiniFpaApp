using Microsoft.AspNetCore.Mvc;
using MiniFPAService.DTOs;
using MiniFPAService.Models;
using MiniFPAService.Repositories;
using MiniFPAService.Services;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MiniFPAService.Controllers
{
    [ApiController]
    [Route("api/finance")]
    public class FinancialRecordsController : ControllerBase
    {
        private readonly IExcelService _excelService;
        private readonly IFinancialRecordService _service;

        public FinancialRecordsController(IExcelService excelService, IFinancialRecordService service)
        {
            _excelService = excelService;
            _service = service;
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadExcel(
            [FromForm] IFormFile file,
            [FromForm] string scenario = "Default",
            [FromForm] string version = null,
            [FromForm] string userName = "System")
        {
            if (file == null)
                return BadRequest("No file uploaded.");

            if (string.IsNullOrEmpty(version))
                version = DateTime.UtcNow.ToString("yyyy-MM-dd-HHmmss");

            using var stream = file.OpenReadStream();
            var dtos = await _excelService.ParseExcelAsync(stream);
            await _service.ProcessExcelUploadAsync(dtos, scenario, version, userName);

            return Ok(new
            {
                Count = dtos.Count,
                Scenario = scenario,
                Version = version,
                UserName = userName,
                Message = "Excel data uploaded successfully"
            });
        }


        [HttpGet]
        public async Task<ActionResult<List<FinancialRecord>>> GetAll()
        {
            var records = await _service.GetAllAsync();
            return Ok(records);
        }

        [HttpGet("type/{type}")]
        public async Task<ActionResult<List<FinancialRecord>>> GetByType(string type)
        {
            var records = await _service.GetByTypeAsync(type);
            return Ok(records);
        }
    }
}


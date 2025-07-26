using Microsoft.AspNetCore.Mvc;
using MiniFPAService.Services;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace MiniFPAService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IFinancialRecordService _service;

        public ReportsController(IFinancialRecordService service)
        {
            _service = service;
        }

        // FEATURE 1: Latest version endpoint
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest([FromQuery] string scenario)
        {
            if (string.IsNullOrEmpty(scenario))
            {
                return BadRequest("Scenario parameter is required.");
            }

            var records = await _service.GetLatestByScenarioAsync(scenario);
            return Ok(records);
        }

        // FEATURE 4: Drill-Down Reporting Endpoint
        [HttpGet("drilldown")]
        public async Task<IActionResult> GetDrilldown(
            [FromQuery] string scenario,
            [FromQuery] string account,
            [FromQuery] string period,
            [FromQuery] string department = null)
        {
            if (string.IsNullOrEmpty(scenario) || string.IsNullOrEmpty(account) || string.IsNullOrEmpty(period))
            {
                return BadRequest("Scenario, Account, and Period parameters are required.");
            }

            var records = await _service.GetDrilldownAsync(scenario, account, period, department);
            return Ok(records);
        }

        // GET: api/reports/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary(
            [FromQuery] string scenario,
            [FromQuery] string account,
            [FromQuery] string department,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to)
        {
            var records = await _service.GetAllAsync();

            var filtered = records.Where(r =>
                (string.IsNullOrEmpty(scenario) || r.Scenario == scenario) &&
                (string.IsNullOrEmpty(account) || r.Account == account) &&
                (string.IsNullOrEmpty(department) || r.Department == department) &&
                (!from.HasValue || new DateTime(r.Year, r.Month, 1) >= from.Value) &&
                (!to.HasValue || new DateTime(r.Year, r.Month, 1) <= to.Value)
            );

            var summary = filtered
                .GroupBy(r => new { r.Account, r.Department, r.Scenario })
                .Select(g => new {
                    Account = g.Key.Account,
                    Department = g.Key.Department,
                    Scenario = g.Key.Scenario,
                    TotalAmount = g.Sum(x => x.Amount)
                });

            return Ok(summary);
        }

        // GET: api/reports/monthly
        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthly(
            [FromQuery] string account,
            [FromQuery] string scenario)
        {
            var records = await _service.GetAllAsync();

            var filtered = records.Where(r =>
                (string.IsNullOrEmpty(account) || r.Account == account) &&
                (string.IsNullOrEmpty(scenario) || r.Scenario == scenario)
            );

            var monthly = filtered
                .GroupBy(r => new { r.Year, r.Month })
                .Select(g => new {
                    Month = $"{g.Key.Year:D4}-{g.Key.Month:D2}",
                    Total = g.Sum(x => x.Amount)
                })
                .OrderBy(x => x.Month);

            return Ok(monthly);
        }

        // FEATURE 2: SCENARIO COMPARISON
        [HttpGet("compare")]
        public async Task<IActionResult> CompareScenarios(
            [FromQuery] string baseScenario,
            [FromQuery] string targetScenario,
            [FromQuery] string period,
            [FromQuery] bool includeDepartment = false)
        {
            if (string.IsNullOrEmpty(baseScenario) || string.IsNullOrEmpty(targetScenario))
            {
                return BadRequest("Both base and target scenarios are required.");
            }

            if (string.IsNullOrEmpty(period))
            {
                return BadRequest("Period parameter is required (e.g., '2024-07').");
            }

            var comparison = await _service.CompareScenarios(baseScenario, targetScenario, period, includeDepartment);
            return Ok(comparison);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using MiniFPAService.Models;
using MiniFPAService.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MiniFPAService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LookupController : ControllerBase
    {
        private readonly IFinancialRecordRepository _repository;

        public LookupController(IFinancialRecordRepository repository)
        {
            _repository = repository;
        }

        // FEATURE 3: FX Rates Management
        [HttpPost("fx-rates")]
        public async Task<IActionResult> AddFXRates([FromBody] List<FXRate> fxRates)
        {
            if (fxRates == null || fxRates.Count == 0)
            {
                return BadRequest("FX rates data is required.");
            }

            await _repository.AddFXRatesAsync(fxRates);
            return Ok(new { Message = "FX rates added successfully", Count = fxRates.Count });
        }

        [HttpGet("fxrates/{fromCurrency}/{toCurrency}/{period}")]
        public async Task<IActionResult> GetFXRate(string fromCurrency, string toCurrency, string period)
        {
            var fxRate = await _repository.GetFXRateAsync(fromCurrency, toCurrency, period);
            if (fxRate == null)
            {
                return NotFound($"FX rate not found for {fromCurrency} to {toCurrency} in period {period}");
            }

            return Ok(fxRate);
        }

        // FEATURE 3: Account Mapping Management
        [HttpPost("account-maps")]
        public async Task<IActionResult> AddAccountMaps([FromBody] List<AccountMap> accountMaps)
        {
            if (accountMaps == null || accountMaps.Count == 0)
            {
                return BadRequest("Account maps data is required.");
            }

            await _repository.AddAccountMapsAsync(accountMaps);
            return Ok(new { Message = "Account maps added successfully", Count = accountMaps.Count });
        }

        [HttpGet("account-maps/{accountCode}")]
        public async Task<IActionResult> GetAccountMap(string accountCode)
        {
            var accountMap = await _repository.GetAccountMapAsync(accountCode);
            if (accountMap == null)
            {
                return NotFound($"Account map not found for code: {accountCode}");
            }

            return Ok(accountMap);
        }

        // New lookup endpoints for dropdown filters
        [HttpGet("scenarios")]
        public async Task<IActionResult> GetScenarios()
        {
            var scenarios = await _repository.GetUniqueScenariosAsync();
            return Ok(scenarios);
        }

        [HttpGet("accounts")]
        public async Task<IActionResult> GetAccounts()
        {
            var accounts = await _repository.GetUniqueAccountsAsync();
            return Ok(accounts);
        }

        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _repository.GetUniqueDepartmentsAsync();
            return Ok(departments);
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinanceDashboard.Application.Interfaces;
using FinanceDashboard.Application.DTOs;

namespace FinanceDashboard.Api.Controllers;

[ApiController]
[Route("api/portfolios")]
[Authorize]
public class PortfoliosController : ControllerBase
{
    private readonly IPortfolioService _portfolioService;

    public PortfoliosController(IPortfolioService portfolioService)
    {
        _portfolioService = portfolioService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var portfolios = await _portfolioService.GetUserPortfoliosAsync();

        var dtos = portfolios.Select(p => new PortfolioDto(
            p.Id,
            p.Title,
            p.Description,
            p.Status.ToString().ToLower(),
            p.CreatedAt
        ));

        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var portfolio = await _portfolioService.GetByIdAsync(id);

        if (portfolio is null)
            return NotFound();

        var dto = new PortfolioDto(
            portfolio.Id,
            portfolio.Title,
            portfolio.Description,
            portfolio.Status.ToString().ToLower(),
            portfolio.CreatedAt
        );

        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreatePortfolioRequest request)
    {
        var portfolio = await _portfolioService.CreateAsync(request);

        var dto = new PortfolioDto(
            portfolio.Id,
            portfolio.Title,
            portfolio.Description,
            portfolio.Status.ToString().ToLower(),
            portfolio.CreatedAt
        );

        return CreatedAtAction(nameof(GetById), new { id = portfolio.Id }, dto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdatePortfolioRequest request)
    {
        try
        {
            await _portfolioService.UpdateAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _portfolioService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
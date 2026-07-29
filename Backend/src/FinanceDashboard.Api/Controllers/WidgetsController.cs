using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinanceDashboard.Application.Services;
using FinanceDashboard.Application.DTOs.Widgets;

namespace FinanceDashboard.Api.Controllers;

[ApiController]
[Route("api/portfolios/{portfolioId:guid}/widgets")]
[Authorize]
public class WidgetsController : ControllerBase
{
    private readonly WidgetService _widgetService;

    public WidgetsController(WidgetService widgetService)
    {
        _widgetService = widgetService;
    }

    [HttpGet]
    public async Task<IActionResult> GetWidgets(Guid portfolioId)
    {
        try
        {
            var widgets = await _widgetService.GetWidgetsByPortfolioAsync(portfolioId);

            var dtos = widgets.Select(w => new WidgetDto(
                w.Id,
                w.PortfolioId,
                w.Kind.ToString().ToLower(),
                w.Name,
                w.Description,
                w.PosX,
                w.PosY,
                w.Width,
                w.Height,
                w.SavingGoal?.TargetAmount,
                w.SavingGoal?.TargetDate
            ));

            return Ok(dtos);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateWidget(Guid portfolioId, CreateWidgetRequest request)
    {
        try
        {
            var widget = await _widgetService.CreateWidgetAsync(portfolioId, request);

            var dto = new WidgetDto(
                widget.Id,
                widget.PortfolioId,
                widget.Kind.ToString().ToLower(),
                widget.Name,
                widget.Description,
                widget.PosX,
                widget.PosY,
                widget.Width,
                widget.Height,
                widget.SavingGoal?.TargetAmount,
                widget.SavingGoal?.TargetDate
            );

            return Ok(dto);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPatch("layout")]
    public async Task<IActionResult> UpdateLayout(Guid portfolioId, [FromBody] List<UpdateWidgetLayoutRequest> requests)
    {
        try
        {
            await _widgetService.UpdateLayoutAsync(portfolioId, requests);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{widgetId:guid}")]
    public async Task<IActionResult> DeleteWidget(Guid portfolioId, Guid widgetId)
    {
        try
        {
            await _widgetService.DeleteWidgetAsync(portfolioId, widgetId);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
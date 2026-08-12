using Microsoft.EntityFrameworkCore;
using FinanceDashboard.Application.Interfaces;
using FinanceDashboard.Domain.Entities;
using FinanceDashboard.Domain.Enums;
using FinanceDashboard.Application.DTOs.Widgets;

namespace FinanceDashboard.Application.Services;

public class WidgetService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public WidgetService(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<Widget>> GetWidgetsByPortfolioAsync(Guid portfolioId)
    {
        var userId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var portfolioExists = await _context.Portfolios
            .AnyAsync(p => p.Id == portfolioId && p.UserId == userId);

        if (!portfolioExists)
            throw new KeyNotFoundException("Portfolio not found or access denied.");

        return await _context.Widgets
            .Include(w => w.SavingGoal)
            .Include(w => w.Tracker)
            .Include(w => w.RecurringExpense)
            .Where(w => w.PortfolioId == portfolioId)
            .ToListAsync();
    }

    public async Task<Widget> CreateWidgetAsync(Guid portfolioId, CreateWidgetRequest request)
    {
        var userId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var portfolio = await _context.Portfolios
            .FirstOrDefaultAsync(p => p.Id == portfolioId && p.UserId == userId);

        if (portfolio is null)
            throw new KeyNotFoundException("Portfolio not found or access denied.");

        int defaultX = 0;
        int defaultY = 0;
        int defaultWidth = 4;
        int defaultHeight = 4;

        var cleanKind = request.Kind.Replace("_", "").ToLower();

        WidgetKind kindEnum = cleanKind switch
        {
            "tracker" => WidgetKind.Tracker,
            "savinggoal" => WidgetKind.SavingGoal,
            "recurringexpense" => WidgetKind.RecurringExpense,
            _ => throw new ArgumentException($"Invalid widget kind: '{request.Kind}'")
        };

        Widget widget = kindEnum switch
        {
            WidgetKind.Tracker => Widget.CreateTracker(
                portfolioId,
                request.Name,
                request.Description,
                defaultX, defaultY, defaultWidth, defaultHeight),

            WidgetKind.SavingGoal => Widget.CreateSavingGoal(
                portfolioId,
                request.Name,
                request.Description,
                request.TargetAmount ?? 0,
                request.TargetDate,
                defaultX, defaultY, defaultWidth, defaultHeight),

            WidgetKind.RecurringExpense => Widget.CreateRecurringExpense(
                portfolioId,
                request.Name,
                request.Description,
                defaultX, defaultY, defaultWidth, defaultHeight),

            _ => throw new ArgumentException($"Invalid widget kind: '{request.Kind}'")
        };

        _context.Widgets.Add(widget);
        await _context.SaveChangesAsync();

        return widget;
    }

    public async Task UpdateWidgetAsync(Guid portfolioId, Guid widgetId, UpdateWidgetRequest request)
    {
        var userId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var widget = await _context.Widgets
            .Include(w => w.Portfolio)
            .FirstOrDefaultAsync(w => w.Id == widgetId && w.PortfolioId == portfolioId && w.Portfolio.UserId == userId);

        if (widget is null)
            throw new KeyNotFoundException("Widget not found or access denied.");

        widget.UpdateDetails(
            request.Name ?? widget.Name,
            request.Description ?? widget.Description
        );

        await _context.SaveChangesAsync();
    }

    public async Task UpdateLayoutAsync(Guid portfolioId, List<UpdateWidgetLayoutRequest> requests)
    {
        var userId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var portfolioExists = await _context.Portfolios
            .AnyAsync(p => p.Id == portfolioId && p.UserId == userId);

        if (!portfolioExists)
            throw new KeyNotFoundException("Portfolio not found or access denied.");

        var widgetIds = requests.Select(r => r.Id).ToList();

        var widgets = await _context.Widgets
            .Where(w => w.PortfolioId == portfolioId && widgetIds.Contains(w.Id))
            .ToListAsync();

        foreach (var req in requests)
        {
            var widget = widgets.FirstOrDefault(w => w.Id == req.Id);
            if (widget is not null)
            {
                widget.Move(req.PosX, req.PosY);
                widget.Resize(req.Width, req.Height);
            }
        }

        await _context.SaveChangesAsync();
    }

    public async Task DeleteWidgetAsync(Guid portfolioId, Guid widgetId)
    {
        var userId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var widget = await _context.Widgets
            .Include(w => w.Portfolio)
            .FirstOrDefaultAsync(w => w.Id == widgetId && w.PortfolioId == portfolioId && w.Portfolio.UserId == userId);

        if (widget is null)
            throw new KeyNotFoundException("Widget not found or access denied.");

        _context.Widgets.Remove(widget);
        await _context.SaveChangesAsync();
    }
}
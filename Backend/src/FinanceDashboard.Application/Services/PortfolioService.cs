using Microsoft.EntityFrameworkCore;
using FinanceDashboard.Application.Interfaces;
using FinanceDashboard.Domain.Entities;
using FinanceDashboard.Domain.Enums;
using FinanceDashboard.Application.DTOs;
using FinanceDashboard.Application.DTOs.Transactions;

namespace FinanceDashboard.Application.Services;

public class PortfolioService : IPortfolioService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public PortfolioService(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<Portfolio>> GetUserPortfoliosAsync()
    {
        var userId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        return await _context.Portfolios
            .Where(p => p.UserId == userId)
            .ToListAsync();
    }

    public async Task<Portfolio?> GetByIdAsync(Guid portfolioId)
    {
        var userId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        return await _context.Portfolios
            .FirstOrDefaultAsync(p => p.Id == portfolioId && p.UserId == userId);
    }

    public async Task<Portfolio> CreateAsync(CreatePortfolioRequest request)
    {
        var userId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var portfolio = new Portfolio(userId, request.Title, request.Description);

        _context.Portfolios.Add(portfolio);

        var defaultSummaryWidget = Widget.CreateSummary(
            portfolioId: portfolio.Id,
            name: "Portfolio Summary",
            description: "Overall portfolio financial balance",
            posX: 0,
            posY: 0,
            width: 12,
            height: 2
        );

        _context.Widgets.Add(defaultSummaryWidget);

        await _context.SaveChangesAsync();

        return portfolio;
    }

    public async Task UpdateAsync(Guid portfolioId, UpdatePortfolioRequest request)
    {
        var userId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var portfolio = await _context.Portfolios
            .FirstOrDefaultAsync(p => p.Id == portfolioId && p.UserId == userId);

        if (portfolio is null)
            throw new KeyNotFoundException("Portfolio not found or access denied.");

        portfolio.UpdateDetails(request.Title, request.Description);

        if (request.Status == PortfolioStatus.Archived)
        {
            portfolio.Archive();
        }
        else
        {
            portfolio.Activate();
        }

        await _context.SaveChangesAsync();
    }

    public async Task<PortfolioSummaryDto> GetPortfolioSummaryAsync(Guid portfolioId)
    {
        var userId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var portfolioExists = await _context.Portfolios
            .AnyAsync(p => p.Id == portfolioId && p.UserId == userId);

        if (!portfolioExists)
            throw new KeyNotFoundException("Portfolio not found or access denied.");

        var baseQuery = _context.Transactions
            .Where(t => t.Widget.PortfolioId == portfolioId);

        var totalIncome = await baseQuery
            .Where(t => t.Type == TransactionType.Income)
            .SumAsync(t => (decimal?)t.Amount) ?? 0m;

        var totalExpenses = await baseQuery
            .Where(t => t.Type == TransactionType.Expense)
            .SumAsync(t => (decimal?)t.Amount) ?? 0m;

        var totalTransactions = await baseQuery.CountAsync();

        var netBalance = totalIncome - totalExpenses;

        return new PortfolioSummaryDto(
            totalIncome,
            totalExpenses,
            netBalance,
            totalTransactions
        );
    }

public async Task<List<TransactionDto>> GetPortfolioTransactionsAsync(Guid portfolioId)
{
    var userId = _currentUser.UserId
        ?? throw new UnauthorizedAccessException("User is not authenticated.");

    var portfolioExists = await _context.Portfolios
        .AnyAsync(p => p.Id == portfolioId && p.UserId == userId);

    if (!portfolioExists)
        throw new KeyNotFoundException("Portfolio not found or access denied.");

    return await _context.Transactions
        .Where(t => t.Widget.PortfolioId == portfolioId)
        .OrderByDescending(t => t.CreatedAt)
        .Select(t => new TransactionDto(
            t.Id,
            t.WidgetId,
            t.Title,
            t.Description,
            t.Amount,
            t.Type.ToString().ToLower(),
            t.RecurringMetadata != null ? (int?)t.RecurringMetadata.PaymentDay : null,
            t.CreatedAt,
            t.Widget.Name
        ))
        .ToListAsync();
}

    public async Task DeleteAsync(Guid portfolioId)
    {
        var userId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var portfolio = await _context.Portfolios
            .FirstOrDefaultAsync(p => p.Id == portfolioId && p.UserId == userId);

        if (portfolio is null)
            throw new KeyNotFoundException("Portfolio not found or access denied.");

        _context.Portfolios.Remove(portfolio);
        await _context.SaveChangesAsync();
    }
}
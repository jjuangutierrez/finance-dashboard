using Microsoft.EntityFrameworkCore;
using FinanceDashboard.Application.Interfaces;
using FinanceDashboard.Domain.Entities;
using FinanceDashboard.Domain.Enums;
using FinanceDashboard.Application.DTOs;

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

        var transactions = await _context.Transactions
            .Where(t => t.Widget.PortfolioId == portfolioId)
            .Select(t => new { t.Amount, t.Type })
            .ToListAsync();

        var totalIncome = transactions
            .Where(t => t.Type == TransactionType.Income)
            .Sum(t => t.Amount);

        var totalExpenses = transactions
            .Where(t => t.Type == TransactionType.Expense)
            .Sum(t => t.Amount);

        var netBalance = totalIncome - totalExpenses;

        return new PortfolioSummaryDto(
            totalIncome,
            totalExpenses,
            netBalance,
            transactions.Count
        );
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
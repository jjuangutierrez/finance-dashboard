using Microsoft.EntityFrameworkCore;
using FinanceDashboard.Application.Interfaces;
using FinanceDashboard.Domain.Entities;
using FinanceDashboard.Application.DTOs.Transactions;

namespace FinanceDashboard.Application.Services;

public class TransactionService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public TransactionService(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<Transaction>> GetTransactionsByWidgetAsync(Guid portfolioId, Guid widgetId)
    {
        var userId = _currentUser.UserId 
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var widgetExists = await _context.Widgets
            .Include(w => w.Portfolio)
            .AnyAsync(w => w.Id == widgetId && w.PortfolioId == portfolioId && w.Portfolio.UserId == userId);

        if (!widgetExists)
            throw new KeyNotFoundException("Widget not found or access denied.");

        return await _context.Transactions
            .Include(t => t.RecurringMetadata)
            .Where(t => t.WidgetId == widgetId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<Transaction> CreateTransactionAsync(Guid portfolioId, Guid widgetId, CreateTransactionRequest request)
    {
        var userId = _currentUser.UserId 
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var widgetExists = await _context.Widgets
            .Include(w => w.Portfolio)
            .AnyAsync(w => w.Id == widgetId && w.PortfolioId == portfolioId && w.Portfolio.UserId == userId);

        if (!widgetExists)
            throw new KeyNotFoundException("Widget not found or access denied.");

        var transaction = new Transaction(
            widgetId,
            request.Title,
            request.Description,
            request.Amount,
            request.Type
        );

        if (request.PaymentDay.HasValue)
        {
            transaction.ConfigureRecurring(request.PaymentDay.Value);
        }

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return transaction;
    }

    public async Task DeleteTransactionAsync(Guid portfolioId, Guid widgetId, Guid transactionId)
    {
        var userId = _currentUser.UserId 
            ?? throw new UnauthorizedAccessException("User is not authenticated.");

        var transaction = await _context.Transactions
            .Include(t => t.Widget)
            .ThenInclude(w => w.Portfolio)
            .FirstOrDefaultAsync(t => t.Id == transactionId && t.WidgetId == widgetId && t.Widget.PortfolioId == portfolioId && t.Widget.Portfolio.UserId == userId);

        if (transaction is null)
            throw new KeyNotFoundException("Transaction not found or access denied.");

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
    }
}
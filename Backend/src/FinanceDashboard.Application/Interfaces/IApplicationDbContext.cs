using FinanceDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinanceDashboard.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Portfolio> Portfolios { get; }
    DbSet<Widget> Widgets { get; }
    DbSet<SavingGoal> SavingGoals { get; }
    DbSet<Tracker> Trackers { get; }
    DbSet<RecurringExpense> RecurringExpenses { get; } 
    DbSet<Transaction> Transactions { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
using FinanceDashboard.Application.Interfaces;
using FinanceDashboard.Domain.Common;
using FinanceDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinanceDashboard.Infrastructure.Persistence;

public class AppDbContext : DbContext, IApplicationDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Portfolio> Portfolios => Set<Portfolio>();
    public DbSet<Widget> Widgets => Set<Widget>();
    public DbSet<Tracker> Trackers => Set<Tracker>();
    public DbSet<SavingGoal> SavingGoals => Set<SavingGoal>();
    public DbSet<RecurringExpense> RecurringExpenses => Set<RecurringExpense>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<RecurringTransactionMetadata> RecurringTransactionMetadata => Set<RecurringTransactionMetadata>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAuditInfo();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void ApplyAuditInfo()
    {
        var utcNow = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.SetCreated(utcNow);
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.SetModified(utcNow);
            }
        }
    }
}
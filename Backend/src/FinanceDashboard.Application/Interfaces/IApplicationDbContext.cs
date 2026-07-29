using FinanceDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinanceDashboard.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users {get;}
    DbSet<Portfolio> Portfolios {get;}
    DbSet<Widget> Widgets {get;}

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
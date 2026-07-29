using FinanceDashboard.Application.DTOs;
using FinanceDashboard.Domain.Entities;

namespace FinanceDashboard.Application.Interfaces;

public interface IPortfolioService
{
    Task<List<Portfolio>> GetUserPortfoliosAsync();
    Task<Portfolio?> GetByIdAsync(Guid portfolioId);
    Task<Portfolio> CreateAsync(CreatePortfolioRequest request);
    Task UpdateAsync(Guid portfolioId, UpdatePortfolioRequest request);
    Task<PortfolioSummaryDto> GetPortfolioSummaryAsync(Guid portfolioId);
    Task DeleteAsync(Guid portfolioId);
}
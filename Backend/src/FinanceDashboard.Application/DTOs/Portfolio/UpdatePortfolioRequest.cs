using FinanceDashboard.Domain.Enums;

namespace FinanceDashboard.Application.DTOs;

public record UpdatePortfolioRequest
(
    string Title,
    string? Description,
    PortfolioStatus Status = PortfolioStatus.Active
);
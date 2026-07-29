namespace FinanceDashboard.Application.DTOs;

public record CreatePortfolioRequest
(
    string Title,
    string? Description
);
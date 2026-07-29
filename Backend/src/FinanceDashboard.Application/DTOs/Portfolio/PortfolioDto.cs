namespace FinanceDashboard.Application.DTOs;

public record PortfolioDto(
    Guid Id,
    string Title,
    string? Description,
    string Status,
    DateTime CreatedAt);
namespace FinanceDashboard.Application.DTOs.Widgets;

public record WidgetDto(
    Guid Id,
    Guid PortfolioId,
    string Kind,
    string Name,
    string? Description,
    int PosX,
    int PosY,
    int Width,
    int Height,
    decimal? TargetAmount = null,
    DateOnly? TargetDate = null);
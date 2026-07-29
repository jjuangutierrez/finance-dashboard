using FinanceDashboard.Domain.Enums;

namespace FinanceDashboard.Application.DTOs.Widgets;

public record CreateWidgetRequest(
    string Kind,
    string Name,
    string? Description,
    decimal? TargetAmount = null,
    DateOnly? TargetDate = null);
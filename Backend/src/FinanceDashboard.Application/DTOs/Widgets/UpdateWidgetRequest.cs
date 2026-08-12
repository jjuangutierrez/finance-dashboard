namespace FinanceDashboard.Application.DTOs.Widgets;

public record UpdateWidgetRequest(
    string? Name,
    string? Description
);
namespace FinanceDashboard.Application.DTOs.Widgets;

public record UpdateWidgetLayoutRequest(
    Guid Id,
    int PosX,
    int PosY,
    int Width,
    int Height);
namespace FinanceDashboard.Application.DTOs;

public record UpdateUserRequest(
    string FirstName,
    string? LastName,
    string UserName);

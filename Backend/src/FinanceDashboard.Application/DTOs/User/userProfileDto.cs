namespace FinanceDashboard.Application.DTOs.User;

public record UserProfileDto(
    Guid Id,
    string FirstName,
    string? LastName,
    string UserName,
    string Email,
    string? PictureUrl,
    string Provider
);
namespace FinanceDashboard.Application.Interfaces;

public interface IGoogleAuthValidator
{
    Task<GoogleUserInfo?> ValidateAsync(string idToken);
}

public record GoogleUserInfo(
    string GoogleId,
    string Email,
    string FirstName,
    string? LastName,
    string? PictureUrl,
    bool IsEmailVerified
);
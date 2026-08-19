using FinanceDashboard.Application.Interfaces;
using Google.Apis.Auth;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace FinanceDashboard.Infrastructure.Authentication;

public class GoogleAuthValidator : IGoogleAuthValidator
{
    private readonly GoogleAuthSettings _settings;
    private readonly ILogger<GoogleAuthValidator> _logger;

    public GoogleAuthValidator(IOptions<GoogleAuthSettings> settings, ILogger<GoogleAuthValidator> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<GoogleUserInfo?> ValidateAsync(string idToken)
    {
        if (string.IsNullOrWhiteSpace(idToken))
            return null;

        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [_settings.ClientId]
            });

            return new GoogleUserInfo(
                GoogleId: payload.Subject,
                Email: payload.Email,
                FirstName: payload.GivenName ?? payload.Name,
                LastName: payload.FamilyName,
                PictureUrl: payload.Picture,
                IsEmailVerified: payload.EmailVerified
            );
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogWarning(ex, "[GoogleAuth] Invalid Google token");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[GoogleAuth] Error to validate Google token");
            return null;
        }
    }
}

public class GoogleAuthSettings
{
    public string ClientId { get; set; } = string.Empty;
}
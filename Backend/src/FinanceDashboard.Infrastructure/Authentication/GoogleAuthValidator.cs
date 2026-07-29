using FinanceDashboard.Application.Interfaces;
using Google.Apis.Auth;
using Microsoft.Extensions.Options;

namespace FinanceDashboard.Infrastructure.Authentication;

public class GoogleAuthValidator : IGoogleAuthValidator
{
    private readonly GoogleAuthSettings _settings;

    public GoogleAuthValidator(IOptions<GoogleAuthSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task<GoogleUserInfo?> ValidateAsync(string idToken)
    {
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
        PictureUrl: payload.Picture
    );
        }
        catch (InvalidJwtException ex)
        {
            Console.WriteLine($"[GoogleAuth] Token inválido: {ex.Message}");
            Console.WriteLine($"[GoogleAuth] ClientId configurado: '{_settings.ClientId}'");
            return null;
        }
    }
}

public class GoogleAuthSettings
{
    public string ClientId { get; set; } = string.Empty;
}
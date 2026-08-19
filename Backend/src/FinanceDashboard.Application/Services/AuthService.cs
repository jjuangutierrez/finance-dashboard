using System.Security.Cryptography;
using System.Text;
using FinanceDashboard.Application.DTOs.Auth;
using FinanceDashboard.Application.Interfaces;
using FinanceDashboard.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinanceDashboard.Application.Services;

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IGoogleAuthValidator _googleAuthValidator;

    public AuthService(
        IApplicationDbContext context,
        IJwtTokenGenerator jwtTokenGenerator,
        IPasswordHasher passwordHasher,
        IGoogleAuthValidator googleAuthValidator)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
        _googleAuthValidator = googleAuthValidator;
    }

    private static string HashRefreshToken(string rawToken)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawToken));
        return Convert.ToBase64String(bytes);
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        var userExists = await _context.Users
            .AnyAsync(u => u.Email == request.Email || u.UserName == request.UserName);

        if (userExists)
        {
            return new AuthResult
            {
                Success = false,
                Errors = ["The email or username is already taken."]
            };
        }

        var passwordHash = _passwordHasher.Hash(request.Password);

        var user = new User(
            request.FirstName,
            request.LastName,
            request.UserName,
            request.Email,
            passwordHash);

        var rawRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();
        user.UpdateRefreshToken(HashRefreshToken(rawRefreshToken), DateTime.UtcNow.AddDays(7));

        _context.Users.Add(user);
        InitializeDefaultPortfolio(user, request.FirstName);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return new AuthResult
            {
                Success = false,
                Errors = ["The email or username is already taken."]
            };
        }

        var token = _jwtTokenGenerator.GenerateToken(user);
        return new AuthResult { Success = true, Token = token, RefreshToken = rawRefreshToken };
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user is null ||
            string.IsNullOrEmpty(user.PasswordHash) ||
            !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return new AuthResult
            {
                Success = false,
                Errors = ["Invalid credentials."]
            };
        }

        var token = _jwtTokenGenerator.GenerateToken(user);
        var rawRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        user.UpdateRefreshToken(HashRefreshToken(rawRefreshToken), DateTime.UtcNow.AddDays(7));
        await _context.SaveChangesAsync();

        return new AuthResult { Success = true, Token = token, RefreshToken = rawRefreshToken };
    }

    public async Task<AuthResult> GoogleAuthAsync(GoogleLoginRequest request)
    {
        var googleUser = await _googleAuthValidator.ValidateAsync(request.IdToken);

        if (googleUser is null || !googleUser.IsEmailVerified)
        {
            return new AuthResult
            {
                Success = false,
                Errors = ["Invalid or unverified Google account."]
            };
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == googleUser.Email);

        if (user is null)
        {
            // 1. Usuario totalmente nuevo -> Se crea con Google
            var uniqueUserName = await GenerateUniqueUserNameAsync(googleUser.Email);
            var safeFirstName = !string.IsNullOrWhiteSpace(googleUser.FirstName)
                ? googleUser.FirstName
                : uniqueUserName;

            user = User.CreateFromGoogle(
                safeFirstName,
                googleUser.LastName,
                userName: uniqueUserName,
                googleUser.Email,
                googleUser.GoogleId,
                googleUser.PictureUrl);

            _context.Users.Add(user);
            InitializeDefaultPortfolio(user, safeFirstName);
        }
        else
        {
            if (string.IsNullOrEmpty(user.GoogleId))
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = ["An account with this email already exists with password. Please log in with your password."]
                };
            }

            if (user.GoogleId != googleUser.GoogleId)
            {
                return new AuthResult
                {
                    Success = false,
                    Errors = ["Google account mismatch for this email."]
                };
            }
        }

        var token = _jwtTokenGenerator.GenerateToken(user);
        var rawRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        user.UpdateRefreshToken(HashRefreshToken(rawRefreshToken), DateTime.UtcNow.AddDays(7));
        await _context.SaveChangesAsync();

        return new AuthResult { Success = true, Token = token, RefreshToken = rawRefreshToken };
    }

    public async Task<AuthResult> RefreshTokenAsync(string refreshToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            return new AuthResult
            {
                Success = false,
                Errors = ["Invalid refresh token."]
            };
        }

        var hashedIncomingToken = HashRefreshToken(refreshToken);

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.RefreshToken == hashedIncomingToken);

        if (user is null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return new AuthResult
            {
                Success = false,
                Errors = ["Invalid or expired refresh token."]
            };
        }

        var newJwtToken = _jwtTokenGenerator.GenerateToken(user);
        var newRawRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        // Guarda el hash del nuevo token
        user.UpdateRefreshToken(HashRefreshToken(newRawRefreshToken), DateTime.UtcNow.AddDays(7));
        await _context.SaveChangesAsync();

        return new AuthResult
        {
            Success = true,
            Token = newJwtToken,
            RefreshToken = newRawRefreshToken
        };
    }

    public async Task<bool> RevokeTokenAsync(string refreshToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
            return false;

        var hashedToken = HashRefreshToken(refreshToken);

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.RefreshToken == hashedToken);

        if (user is null)
            return false;

        user.RevokeRefreshToken();
        await _context.SaveChangesAsync();

        return true;
    }

    private void InitializeDefaultPortfolio(User user, string creatorName)
    {
        var defaultPortfolio = new Portfolio(
            userId: user.Id,
            title: "First portfolio",
            description: "Started portfolio",
            createdBy: creatorName
        );

        var defaultSummaryWidget = Widget.CreateSummary(
            portfolioId: defaultPortfolio.Id,
            name: "Portfolio Summary",
            description: "Overall portfolio financial balance",
            posX: 0,
            posY: 0,
            width: 12,
            height: 2
        );

        _context.Portfolios.Add(defaultPortfolio);
        _context.Widgets.Add(defaultSummaryWidget);
    }

    private async Task<string> GenerateUniqueUserNameAsync(string email)
    {
        var baseName = email.Split('@')[0];
        var userName = baseName;
        var counter = 1;

        while (await _context.Users.AnyAsync(u => u.UserName == userName))
        {
            userName = $"{baseName}{counter++}";
        }

        return userName;
    }
}
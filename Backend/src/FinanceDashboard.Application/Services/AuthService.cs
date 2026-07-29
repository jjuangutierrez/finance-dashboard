using FinanceDashboard.Application.Interfaces;
using FinanceDashboard.Application.DTOs.Auth;
using Microsoft.EntityFrameworkCore;
using FinanceDashboard.Domain.Entities;

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

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser is not null)
        {
            return new AuthResult
            {
                Success = false,
                Errors = ["The email address is already registered."]
            };
        }

        var passwordHash = _passwordHasher.Hash(request.Password);

        var user = new User(
            request.FirstName,
            request.LastName,
            request.UserName,
            request.Email,
            passwordHash);

        _context.Users.Add(user);

        var defaultPortfolio = new Portfolio(
            userId: user.Id,
            title: "First portfolio",
            description: "Started portfolio",
            createdBy: request.FirstName
        );

        _context.Portfolios.Add(defaultPortfolio);

        await _context.SaveChangesAsync();

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResult
        {
            Success = true,
            Token = token
        };
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return new AuthResult
            {
                Success = false,
                Errors = ["invalid credentials"]
            };
        }

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResult
        {
            Success = true,
            Token = token
        };
    }

    public async Task<AuthResult> GoogleAuthAsync(GoogleLoginRequest request)
    {
        var googleUser = await _googleAuthValidator.ValidateAsync(request.IdToken);

        if (googleUser is null)
        {
            return new AuthResult
            {
                Success = false,
                Errors = ["Token de Google inválido."]
            };
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == googleUser.Email);

        if (user is null)
        {
            user = User.CreateFromGoogle(
                googleUser.FirstName,
                googleUser.LastName,
                userName: googleUser.Email.Split('@')[0],
                googleUser.Email,
                googleUser.GoogleId,
                googleUser.PictureUrl);

            _context.Users.Add(user);

            var defaultPortfolio = new Portfolio(
                userId: user.Id,
                title: "First portfolio",
                description: "Started porfolio",
                createdBy: googleUser.FirstName
            );

            _context.Portfolios.Add(defaultPortfolio);

            await _context.SaveChangesAsync();
        }

        var token = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResult
        {
            Success = true,
            Token = token
        };
    }

    public Task<AuthResult> RefreshTokenAsync(string refreshToken)
    {
        throw new NotImplementedException();
    }
}
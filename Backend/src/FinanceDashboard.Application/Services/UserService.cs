using Microsoft.EntityFrameworkCore;
using FinanceDashboard.Application.Interfaces;
using FinanceDashboard.Domain.Entities;
using FinanceDashboard.Application.DTOs;

namespace FinanceDashboard.Application.Services;

public class UserService : IUserService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UserService(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<User?> GetCurrentUserAsync()
    {
        var userId = _currentUser.UserId;

        if (userId is null)
            return null;

        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task UpdateAsync(UpdateUserRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == _currentUser.UserId);

        if (user is null)
            throw new Exception("User not found.");

        user.UpdateProfile(request.FirstName, request.LastName, request.UserName);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync()
    {
        var userId = _currentUser.UserId;

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
            throw new Exception("User not found.");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }
}

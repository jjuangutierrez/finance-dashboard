using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinanceDashboard.Application.Interfaces;
using FinanceDashboard.Application.DTOs;
using FinanceDashboard.Application.DTOs.User;

namespace FinanceDashboard.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var user = await _userService.GetCurrentUserAsync();

        if (user is null)
            return NotFound();

        var provider = string.IsNullOrEmpty(user.GoogleId) ? "Password" : "Google";

        var dto = new UserProfileDto(
            user.Id,
            user.FirstName,
            user.LastName,
            user.UserName,
            user.Email,
            user.PictureUrl,
            provider
        );

        return Ok(dto);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe(UpdateUserRequest request)
    {
        await _userService.UpdateAsync(request);
        return NoContent();
    }

    [HttpDelete("me")]
    public async Task<IActionResult> DeleteMe()
    {
        await _userService.DeleteAsync();
        return NoContent();
    }
}
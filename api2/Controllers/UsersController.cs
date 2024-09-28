using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using api2.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;

    public UsersController(UserManager<IdentityUser> userManager)
    {
        _userManager = userManager;
    }

    // Get all users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<IdentityUser>>> GetUsers()
    {
        var users = _userManager.Users.ToList();
        return Ok(users);
    }

    // Get user by ID
    [HttpGet("{id}")]
    public async Task<ActionResult<IdentityUser>> GetUserById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    // Update user
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, IdentityUser updatedUser)
    {
        if (id != updatedUser.Id)
        {
            return BadRequest();
        }

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        user.Email = updatedUser.Email;
        user.PasswordHash = updatedUser.PasswordHash;
        // Update other fields as necessary

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return NoContent();
    }

    // Delete user
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return NoContent();
    }

    [HttpGet("current")]
    public async Task<ActionResult<IdentityUser>> GetCurrentUser()
    {
        var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();

        if (!claims.Any())
        {
            return NotFound("No claims found. The token might not be properly recognized.");
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return NotFound("userId was not found with key: " + Request.Headers["Authorization"].ToString());
        }
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound("user was not found with this userId: " + userId);
        }

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email
        };

        return Ok(userDto);
    }

    [HttpGet("validate-token")]
    public async Task<ActionResult<UserDto>> ValidateToken()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email
        };

        return Ok(userDto);
    }
}

using erudits.api.Models.User;
using erudits.api.Services.User.interfaces;
using Microsoft.AspNetCore.Mvc;

namespace erudits.api.Controllers.User;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(CreateUserRequest request)
    {
        return Ok(await userService.RegisterUser(request));
    }
}
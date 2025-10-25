using erudits.api.Models;
using erudits.api.Models.User;
using erudits.api.Repositories.User.interfaces;
using erudits.api.Services.User.interfaces;
using Microsoft.AspNetCore.Identity;

namespace erudits.api.Services.User;

public class UserService (IUserRepository userRepository) :  IUserService
{
    private readonly PasswordHasher<UserEntity> _passwordHasher = new();
    
    public async Task<BaseResponse> RegisterUser(CreateUserRequest request)
    {
        try
        {
            var passwordHash = _passwordHasher.HashPassword(null!, request.Password);
            await userRepository.Create(new UserEntity
            {
                Email = request.Email,
                Username = request.Username,
                Password = passwordHash,
            });
            return new BaseResponse { IsSuccess = true };
        }
        catch (Exception e)
        {
            throw new Exception($"Failed to register user - {e.Message}");
        }
    }
}
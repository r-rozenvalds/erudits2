using erudits.api.Models;
using erudits.api.Models.User;

namespace erudits.api.Services.User.interfaces;

public interface IUserService
{
    Task<BaseResponse> RegisterUser(CreateUserRequest request);
}
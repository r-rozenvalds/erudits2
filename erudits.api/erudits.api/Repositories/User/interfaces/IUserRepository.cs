using erudits.api.Models.User;

namespace erudits.api.Repositories.User;

public interface IUserRepository
{
    Task Create(CreateUserRequest request);
}
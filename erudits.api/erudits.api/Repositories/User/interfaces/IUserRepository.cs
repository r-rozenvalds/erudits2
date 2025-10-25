using erudits.api.Models.User;

namespace erudits.api.Repositories.User.interfaces;

public interface IUserRepository
{
    Task Create(UserEntity entity);
}
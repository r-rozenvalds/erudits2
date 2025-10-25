using erudits.api.Db;
using erudits.api.Models.User;
using erudits.api.Repositories.User.interfaces;

namespace erudits.api.Repositories.User;

public class UserRepository(EruditsDbContext context) : IUserRepository
{
    public async Task Create(UserEntity entity)
    {
        await context.Users.AddAsync(entity);
    }
}
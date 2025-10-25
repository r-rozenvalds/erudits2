using erudits.api.Models.User;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace erudits.api.Db;

public class DbConnection : IdentityDbContext<User>
{
    public DbConnection(DbContextOptions<DbConnection> options) : base(options)
    {
    }
    
    
}


using erudits.api.Models.User;
using Microsoft.EntityFrameworkCore;

namespace erudits.api.Db;

public class EruditsDbContext : DbContext
{
    public DbSet<UserEntity> Users { get; set; }
    public EruditsDbContext(DbContextOptions<EruditsDbContext> options) : base(options) { }
}
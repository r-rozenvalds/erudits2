using erudits.api.Models;
using erudits.api.Models.User;
using Microsoft.EntityFrameworkCore;

namespace erudits.api.Db;

public class EruditsDbContext : DbContext
{
    public DbSet<UserEntity> Users { get; set; }
    public EruditsDbContext(DbContextOptions<EruditsDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType).Property<Guid>("Id")
                    .HasDefaultValueSql("NEWID()");
                
                modelBuilder.Entity(entityType.ClrType).Property<long>("Created")
                    .HasDefaultValueSql("DATEDIFF_BIG(SECOND, '1970-01-01', SYSUTCDATETIME())");

                modelBuilder.Entity(entityType.ClrType).Property<long>("Modified")
                    .HasDefaultValueSql("-1");
            }
        }
        
        // User
        modelBuilder.Entity<UserEntity>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<UserEntity>().Property(x => x.Role).HasDefaultValue(Role.Unverified);
        modelBuilder.Entity<UserEntity>().Property(x => x.DeactivatedDate).HasDefaultValue(-1);
    }
}
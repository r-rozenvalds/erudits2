using System.ComponentModel.DataAnnotations;

namespace erudits.api.Models.User;
public class UserEntity : BaseEntity
{
    [MaxLength(128)]
    public required string Username { get; set; }
    [MaxLength(255)]
    public required string Password { get; set; }
    [MaxLength(255)]
    public required string Email { get; set; }
    public Role Role { get; set; }
    public long DeactivatedDate { get; set; }
}

public enum Role
{
    Unverified = 0,
    Basic = 1,
    Admin = 2,
}
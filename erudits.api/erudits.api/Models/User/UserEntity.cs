namespace erudits.api.Models.User;
public class UserEntity : BaseEntity
{
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required string Email { get; set; }
}
namespace erudits.api.Models.Game;

public class GameEntity : BaseEntity
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public long LastActivation { get; set; }
    public Guid UserId { get; set; }
}
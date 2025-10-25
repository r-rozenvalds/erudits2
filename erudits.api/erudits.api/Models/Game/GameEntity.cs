namespace erudits.api.Models.Game;

public class Game : BaseEntity
{
    public string Title { get; set; }
    public string Description { get; set; }
    public long LastActivation { get; set; }
    public Guid UserId { get; set; }
}
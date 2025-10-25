namespace erudits.api.Models.Player;

public class PlayerEntity :  BaseEntity
{
    public Guid InstanceId { get; set; }
    public required string Name { get; set; }
    public int Points { get; set; }
    public bool IsDisqualified { get; set; }
    public bool HasFinishedRound { get; set; }
}
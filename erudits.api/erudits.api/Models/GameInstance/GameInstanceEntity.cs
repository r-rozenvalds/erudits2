namespace erudits.api.Models.GameInstance;

public class GameInstanceEntity : BaseEntity
{
    public Guid GameId { get; set;  }
    public Guid CurrentRoundId { get; set; }
    public Guid CurrentQuestionId { get; set; }
    public bool IsPrivate { get; set; }
    public required string Code { get; set; }
    public long EndDate { get; set; }
    public long StartedAt { get; set; }
}
namespace erudits.api.Models.Round;

public class Round : BaseEntity
{
    public Guid GameId { get; set; }
    public string Title { get; set; }
    public int DisqualifyAmount { get; set; }
    public float AnswerTime { get; set; }
    public float Points { get; set; }
    public bool IsAdditional { get; set; }
    public bool IsTest { get; set; }
    public int Order { get; set; }
}
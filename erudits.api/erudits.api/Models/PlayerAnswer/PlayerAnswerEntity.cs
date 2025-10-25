namespace erudits.api.Models.PlayerAnswer;

public class PlayerAnswerEntity : BaseEntity
{
    public Guid InstanceId { get; set; }
    public Guid PlayerId { get; set; }
    public Guid QuestionId { get; set; }
    public Guid? AnswerId { get; set; }
    public string? AnswerText { get; set; }
}
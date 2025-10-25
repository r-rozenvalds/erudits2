namespace erudits.api.Models.Question;

public class QuestionEntity : BaseEntity
{
    public Guid RoundId { get; set; }
    public required string Title { get; set; }
    public bool IsTextAnswer { get; set; }
    public int Order { get; set; }
}
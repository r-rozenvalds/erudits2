namespace erudits.api.Models.Answer;

public class AnswerEntity
{
    public Guid QuestionId { get; set; }
    public required string Title { get; set; }
    public bool IsCorrect { get; set; }
}
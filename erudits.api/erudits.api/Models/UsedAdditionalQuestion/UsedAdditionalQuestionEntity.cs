namespace erudits.api.Models.UsedAdditionalQuestion;

public class UsedAdditionalQuestionEntity : BaseEntity
{
    public Guid InstanceId { get; set; }
    public Guid QuestionId { get; set; }
}
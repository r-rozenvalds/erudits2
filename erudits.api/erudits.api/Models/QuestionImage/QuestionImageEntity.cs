namespace erudits.api.Models.QuestionImage;

public class QuestionImageEntity : BaseEntity
{
    public Guid QuestionId { get; set; }
    public string? Guidelines { get; set; }
    public required string ImageUrl { get; set; }
}
namespace api2.Models
{
    public class Answer
    {
        public Guid Id { get; set; }
        public string? Prompt {  get; set; }
        public bool IsCorrect { get; set; } = false;
    }
}

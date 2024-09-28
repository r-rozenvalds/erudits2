namespace api2.Models
{
    public class Question
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public bool IsOpenAnswer { get; set; } = false;
        public Answer[] Answers { get; set; } = new Answer[0];
    }
}

namespace api2.Models
{
    public class Round
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public int DisqualifyAmount { get; set; }  = 0;
        public int AnswerTime { get; set; } = 30;
        public int Points { get; set; } = 0;
        public bool IsAdditional { get; set; } = false;
    }
}

using Microsoft.AspNetCore.Identity;

namespace api2.Models
{
    public class Game
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string? Name { get; set; } 
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? LastPlayed {  get; set; }
        public string UserId { get; set; }

    }
}

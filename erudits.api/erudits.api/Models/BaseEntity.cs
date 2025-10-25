namespace erudits.api.Models;

public class BaseEntity
{
    public required string Id { get; set; }
    public long Created { get; set; }
    public long Modified { get; set; }
}
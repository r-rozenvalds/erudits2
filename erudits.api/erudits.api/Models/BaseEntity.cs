namespace erudits.api.Models;

public class BaseEntity
{
    public Guid Id { get; set; }
    public long Created { get; set; }
    public long Modified { get; set; }
}
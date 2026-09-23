namespace gymfit.Models
{
    public class Trainer : User
    {
        public string? Bio { get; set; }
        public string Specialization { get; set; } = string.Empty;
        public ICollection<SportClass> Classes { get; set; }
    }
}

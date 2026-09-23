namespace gymfit.Models
{
    public class Membership
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public decimal Price { get; set; }
        public int DurationDays { get; set; }

        public ICollection<UserMembership> UserMemberships { get; set; }
    }
}

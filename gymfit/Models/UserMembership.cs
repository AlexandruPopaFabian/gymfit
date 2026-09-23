namespace gymfit.Models
{
    public class UserMembership
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int MembershipId { get; set; }
        public Membership Membership { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}

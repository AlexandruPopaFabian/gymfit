namespace gymfit.Models
{
    public class ClassBooking
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int ClassScheduleId { get; set; }
        public ClassSchedule ClassSchedule { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}

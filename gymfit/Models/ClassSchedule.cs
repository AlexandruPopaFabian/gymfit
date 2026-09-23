namespace gymfit.Models
{
    public class ClassSchedule
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public int SportClassId { get; set; }
        public SportClass SportClass { get; set; }

        public ICollection<ClassBooking> Bookings { get; set; }
    }
}

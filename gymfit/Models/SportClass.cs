namespace gymfit.Models
{
    public class SportClass
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public int TrainerId { get; set; }
        public Trainer Trainer { get; set; }

        public ICollection<ClassSchedule> Schedules { get; set; }
    }
}

using System.Numerics;

namespace gymfit.Models
{
    public class SportClass
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int? Duration { get; set; }

        public string? Level { get; set; }
        public string? TrainingType { get; set; }

        public string? Equipment { get; set; }
        public ICollection<Trainer> Trainers { get; set; } = new List<Trainer>();

        public string? ImageUrl { get; set; }
        public ICollection<ClassSchedule>? Schedules { get; set; }
    }
}

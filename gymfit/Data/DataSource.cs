using gymfit.Models;

namespace gymfit.Data
{
    public static class DataSource
    {
        public static IList<Trainer> Trainers = new List<Trainer>
        {
            new Trainer
            {
                Id = 1,
                Name = "Andrei Popescu",
                Email = "andrei.trainer@gymfit.com",
                PasswordHash = "hash124",
                Bio = "Fost atlet de performanță, pasionat de antrenamente funcționale.",
                Specialization = "Functional Training",
                Classes = new List<SportClass>()
            },
            new Trainer
            {
                Id = 2,
                Name = "Maria Ionescu",
                Email = "maria.trainer@gymfit.com",
                PasswordHash = "hash456",
                Bio = "Antrenoare certificată, specializată în yoga și mobilitate.",
                Specialization = "Yoga & Mobility",
                Classes = new List<SportClass>()
            },
            new Trainer
            {
                Id = 3,
                Name = "Alex Dumitru",
                Email = "alex.trainer@gymfit.com",
                PasswordHash = "hash789",
                Bio = "Expert în bodybuilding și nutriție sportivă.",
                Specialization = "Bodybuilding",
                Classes = new List<SportClass>()
            }
        };

        public static IList<User> Users = Trainers.Cast<User>().ToList();

        public static IList<SportClass> SportClasses = new List<SportClass>
        {
            new SportClass
            {
                Id = 1,
                Name = "Yoga",
                Description = "Relax",
                TrainerId = 1,
                Trainer = Trainers[0],
                Schedules = new List<ClassSchedule>()
            },
            new SportClass
            {
                Id = 2,
                Name = "Functional Training",
                Description = "Antrenament intens pentru forță și mobilitate",
                TrainerId = 1,
                Trainer = DataSource.Trainers[0],
                Schedules = new List<ClassSchedule>()
            },
            new SportClass
            {
                Id = 3,
                Name = "Bodybuilding",
                Description = "Creștere musculară și antrenament cu greutăți",
                TrainerId = 3,
                Trainer = DataSource.Trainers[2],
                Schedules = new List<ClassSchedule>()
            },
            new SportClass
            {
                Id = 4,
                Name = "Mobility & Stretch",
                Description = "Mobilitate, stretching și recuperare",
                TrainerId = 2,
                Trainer = DataSource.Trainers[1],
                Schedules = new List<ClassSchedule>()
            }

        };
    }
}


using gymfit.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace gymfit.Data
{
    public class GymFitContext : DbContext
    {
        public GymFitContext(DbContextOptions<GymFitContext> options) : base(options)
        {
        }
        public DbSet<Models.User> Users { get; set; }
        public DbSet<Models.Trainer> Trainers { get; set; }
        public DbSet<Models.Admin> Admins { get; set; }
        public DbSet<Models.SportClass> SportClasses { get; set; }
        public DbSet<Models.ClassSchedule> ClassSchedules { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<UserMembership>().HasKey(um => um.Id);

            modelBuilder.Entity<UserMembership>()
                .HasOne(um => um.User)
                .WithMany()
                .HasForeignKey(um => um.UserId);

            modelBuilder.Entity<UserMembership>()
                .HasOne(um => um.Membership)
                .WithMany(m => m.UserMemberships)
                .HasForeignKey(um => um.MembershipId);
        }
    }
}

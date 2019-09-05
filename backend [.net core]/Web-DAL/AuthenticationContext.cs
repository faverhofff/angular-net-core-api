using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebDAL.Models;

namespace WebDAL
{
    public class AuthenticationContext : IdentityDbContext
    {
        public AuthenticationContext(DbContextOptions options):base(options)
        {

        }

        public DbSet<User> Users { get; set; }
    }
}

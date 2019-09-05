using Microsoft.AspNetCore.Identity;
using System.ComponentModel;

namespace WebDAL.Models
{
    public class User : IdentityUser
    {
        public string Name { get; set; }
        public string LastName { get; set; }
        public int Years { get; set; }
        public string PostDate { get; set; }
        public string Position { get; set; }
    }
}

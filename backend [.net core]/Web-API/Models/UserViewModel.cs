using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class UserViewModel
    {
        public string Id { get; set; }
        [Required]
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public int Years { get; set; }
        public string PostDate { get; set; }
        public string Position { get; set; }
        public string securityStamp { get; set; }
    }
}

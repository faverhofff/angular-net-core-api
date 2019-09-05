using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    [Table("AspNetUsers")]
    public class UserModel 
    {
        public string Name { get; set; }
        public string LastName { get; set; }
        public int Years { get; set; }
        public string PostDate { get; set; }
        public string JobPost { get; set; }
    }
}

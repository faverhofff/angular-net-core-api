using System.ComponentModel.DataAnnotations;

namespace WebAPI.Model.Requests
{
    public class LoginRequest
    {
        [Required]
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

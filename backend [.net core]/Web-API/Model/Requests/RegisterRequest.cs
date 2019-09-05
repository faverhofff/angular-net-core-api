using System.ComponentModel.DataAnnotations;

namespace WebAPI.Model.Requests
{
    public class RegisterRequest
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Models;
using WebApplication.Services;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private UserManager<User> _userManager;
        private SignInManager<User> _singInManager;
        private readonly Settings _appSettings;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IOptions<Settings> appSettings)
        {
            _userManager = userManager;
            _singInManager = signInManager;
            _appSettings = appSettings.Value;
        }

        [HttpPost]
        [Route("Login")]
        //POST : /api/Auth/Login
        public async Task<IActionResult> Login([FromBody]LoginViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (!(user != null && await _userManager.CheckPasswordAsync(user, model.Password)))
                return Unauthorized();

            var token = TokenService.getToken(user, _appSettings);

            return Ok(new { token, user, status = "OK" });
        }


        [HttpPost]
        [Route("Register")]
        //POST : /api/Auth/Register
        public async Task<Object> RegisterNewUser([FromBody]RegisterViewModel model)
        {
            var applicationUser = new User() {
                Email = model.Email,
                UserName = model.Email,
                Name = model.Email
            };
            
            try
            {
                var result = await _userManager.CreateAsync(applicationUser, model.Password);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { result = false, message = ex.Message });
            }
        }

    }
}
using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebDAL.Models;
using WebApplication.Services;
using WebAPI.Model.Requests;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private UserManager<User> _userManager;
        private SignInManager<User> _singInManager;
        private readonly Settings _appSettings;
        private readonly IMapper _mapper;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IMapper mapper, IOptions<Settings> appSettings)
        {
            _userManager = userManager;
            _singInManager = signInManager;
            _appSettings = appSettings.Value;
            _mapper = mapper;
        }

        /// <summary>
        /// POST : /api/Auth/Login
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("Login")]        
        public async Task<IActionResult> Login([FromBody]LoginRequest model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if ( user == null || await _userManager.CheckPasswordAsync(user, model.Password) == false )
                return Unauthorized();

            var token = TokenService.getToken(user, _appSettings);

            return Ok(new { token, user, status = "OK" });
        }


        /// <summary>
        /// POST : /api/Auth/Register
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("Register")]
        public async Task<Object> RegisterNewUser([FromBody]RegisterRequest model)
        {
            var applicationUser = _mapper.Map<User>(model);
            
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
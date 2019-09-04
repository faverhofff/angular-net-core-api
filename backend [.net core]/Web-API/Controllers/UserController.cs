using System;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private UserManager<User> _userManager;
        private readonly Settings _appSettings;
        private readonly IHostingEnvironment _hostingEnvironment;

        public UserController(UserManager<User> userManager, IOptions<Settings> appSettings, IMapper mapper, IHostingEnvironment hostingEnvironment)
        {
            _userManager = userManager;
            _appSettings = appSettings.Value;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost, Authorize]
        [Route("List")]
        public async Task<DataTable> List([FromBody]DataTableViewModel dtViewModel)
        {
            var list = this._userManager.Users.ToArray<User>();

            return new DataTable()
            {
                draw = dtViewModel.draw,
                recordsTotal = list.Length,
                recordsFiltered = list.Length,
                data = list.ToArray()
            };
        }

        [HttpPost, Authorize]
        public async Task<Object> Create([FromBody]UserViewModel model)
        {
            var applicationUser = new User()
            {
                Email = model.Email,
                UserName = model.Email,
                Name = model.Name,
                LastName = model.LastName,
                Years = model.Years,
                PostDate = model.PostDate,
                Position = model.Position
            };

            try
            {
                var result = await _userManager.CreateAsync(applicationUser, model.Password);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut, Authorize]
        public async Task<Object> Update([FromBody]UserViewModel model)
        {
            var applicationUser = await _userManager.FindByIdAsync(model.Id);
            
            applicationUser.Position = model.Position;
            applicationUser.Email = model.Email;
            applicationUser.Name = model.Name;
            applicationUser.LastName = model.LastName;
            applicationUser.Years = model.Years;
            applicationUser.PostDate = model.PostDate;
            applicationUser.Position = model.Position;

            try
            {
                var result = await _userManager.UpdateAsync(applicationUser);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            try
            {
                var result = await _userManager.DeleteAsync(user);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost, DisableRequestSizeLimit, Authorize]
        [Route("Upload")]
        public async Task<IActionResult> UploadFile()
        {
            try
            {
                var file = Request.Form.Files[0];
                string folderName = "Upload";
                string webRootPath = _hostingEnvironment.ContentRootPath.Replace("Web-API", "Web-UPLOAD");
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).Name.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
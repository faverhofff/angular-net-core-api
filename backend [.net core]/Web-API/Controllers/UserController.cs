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
using Web_Application.Services;
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
        private readonly IMapper _mapper;

        public UserController(UserManager<User> userManager, IOptions<Settings> appSettings, IMapper mapper, IHostingEnvironment hostingEnvironment)
        {
            _userManager = userManager;
            _appSettings = appSettings.Value;   
            _hostingEnvironment = hostingEnvironment;
            _mapper = mapper;
        }

        [Route("List")]
        [HttpPost, Authorize]
        public async Task<DataTable> List([FromBody]DataTableViewModel dtViewModel)
        {
            var list = this._userManager.Users.ToArray<User>();

            var dataTableResult = _mapper.Map<DataTable>(list);

            dataTableResult.draw = dtViewModel.draw;

            return dataTableResult;
        }

        [HttpPost, Authorize]
        public async Task<Object> Create([FromBody]UserViewModel model)
        {
            var applicationUser = _mapper.Map<User>(model);

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

            //applicationUser = _mapper.Map<User>(model);

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

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [Route("Upload")]
        [HttpPost, DisableRequestSizeLimit, Authorize]
        public async Task<IActionResult> UploadFile()
        {
            if (Request.Form.Files.Count == 0)
                return BadRequest();

            try
            {
                var webRootPath = _hostingEnvironment.ContentRootPath.Replace("Web-API", "Web-UPLOAD");
                var directoryToDownload = DirectoryService.getUploadDirectory(webRootPath);

                UploadService.UploadFile(Request.Form.Files[0], directoryToDownload);
                
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
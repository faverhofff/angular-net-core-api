using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Text;

namespace Web_Application.Services
{
    public class UploadService
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="file"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        static public bool UploadFile(IFormFile file, string path)
        {
            string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).Name.Trim('"');
            string fullPath = Path.Combine(path, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            return true;
        }
    }
}

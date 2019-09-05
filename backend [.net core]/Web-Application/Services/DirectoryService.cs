using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Web_Application.Services
{
    public class DirectoryService
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="webRootPath"></param>
        /// <param name="folderName"></param>
        /// <returns></returns>
        static public string getUploadDirectory(string webRootPath, string folderName = "Upload")
        {
            string newPath = Path.Combine(webRootPath, folderName);
            if (!Directory.Exists(newPath))
                Directory.CreateDirectory(newPath);

            return newPath;
        }
    }
}

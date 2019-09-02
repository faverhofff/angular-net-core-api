using System;
using System.Collections.Generic;
using System.Text;
using WebAPI.Models;
using WebDAL;

namespace WebApplication.Services
{
    class UserService
    {
        private readonly AuthenticationContext DbContext;

        public UserService(AuthenticationContext dbContext)
        {
            this.DbContext = dbContext;
        }

        public void GetAllUsers()
        {
            
        }
    }
}

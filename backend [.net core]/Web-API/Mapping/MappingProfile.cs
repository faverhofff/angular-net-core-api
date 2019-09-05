using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserViewModel, User>()
                .AfterMap((src, dest) =>
                {
                    dest.Id = dest.Id == "-1" ? null : dest.Id;
                    dest.UserName = dest.UserName ?? src.Email;
                })
                .ForAllOtherMembers(opt => opt.Ignore());

            CreateMap<User[], DataTable>()
                .AfterMap((src, dest) =>
                {
                    dest.recordsTotal = src.Length;
                    dest.recordsFiltered = src.Length;
                    dest.data = src.ToArray();
                });

            CreateMap<RegisterViewModel, User>()
                .AfterMap((src, dest) =>
                {
                    dest.UserName = src.Email;
                });

        }
    }
}

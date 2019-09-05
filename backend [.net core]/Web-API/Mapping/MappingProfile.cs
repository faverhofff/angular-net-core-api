using AutoMapper;
using System.Linq;
using WebApi.Model.Response;
using WebAPI.Model.Requests;
using WebDAL.Models;

namespace WebAPI.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserRequest, User>()
                .AfterMap((src, dest) =>
                {
                    dest.Id = dest.Id == "-1" ? null : dest.Id;
                    dest.UserName = dest.UserName ?? src.Email;
                }).IncludeAllDerived();

            CreateMap<User[], DataTableResponse>()
                .AfterMap((src, dest) =>
                {
                    dest.recordsTotal = src.Length;
                    dest.recordsFiltered = src.Length;
                    dest.data = src.ToArray();
                });

            CreateMap<RegisterRequest, User>()
                .AfterMap((src, dest) =>
                {
                    dest.UserName = src.Email;
                });

        }
    }
}

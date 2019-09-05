
namespace WebApi.Model.Response
{
    public class DataTableResponse
    {
        public string draw;
        public int recordsTotal;
        public int recordsFiltered;
        public object[] data;
    }
}

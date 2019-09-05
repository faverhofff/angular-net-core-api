using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebDAL.Models
{
    public class DataTable
    {
        public string draw;
        public int recordsTotal;
        public int recordsFiltered;
        public object[] data;
    }
}

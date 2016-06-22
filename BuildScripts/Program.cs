using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuildScripts
{
    class Program
    {
        static void Main(string[] args)
        {
            CombineFiles.Combine();
            Console.WriteLine(string.Format("done... Saved scripts into: {0}", CombineFiles.DESTINATION_FILE));
            Console.WriteLine(string.Format("done... Saved scripts into: {0}", CombineFiles.DESTINATION_FILE_MIN));
        }
    }
}

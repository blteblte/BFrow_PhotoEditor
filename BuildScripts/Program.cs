using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BuildScripts
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Starting build...");
            Thread.Sleep(1000);

            CombineFiles.Combine();
            Console.WriteLine(string.Format("done... Saved scripts into: {0}", CombineFiles.DESTINATION_FILE));
            Console.WriteLine(string.Format("done... Saved scripts into: {0}", CombineFiles.DESTINATION_FILE_MIN));

            Build.BuildRelease();
            Console.WriteLine("... release files built");
        }
    }
}

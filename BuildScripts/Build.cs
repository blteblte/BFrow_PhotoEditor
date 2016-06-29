using Microsoft.Ajax.Utilities;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace BuildScripts
{
    public class Build
    {
        private static List<SdkBuildFile> SdkBuildFiles
        {
            get
            {
                return new List<SdkBuildFile>
                {
                    new SdkBuildFile
                    {
                        Path = @"\js\PhotoEditorSDK\" + Constants.versionToBuild + @"\js\PhotoEditorReactUI.js",
                        SaveFileName = "PhotoEditorReactUI.min.js"
                    },
                    new SdkBuildFile
                    {
                        Path = @"\js\PhotoEditorSDK\" + Constants.versionToBuild + @"\js\PhotoEditorSDK.js",
                        SaveFileName = "PhotoEditorSDK.min.js"
                    }
                };
            }
        }

        private static List<string> ExtensionsToSkip
        {
            get
            {
                return new List<string> { "ts" };
            }
        }

        private static List<string> FoldersToSkip
        {
            get
            {
                return new List<string> { "photo-editor", "typings" };
            }
        }

        private static List<string> FileNamesToSkip
        {
            get
            {
                return new List<string> { "jquery-ImageContainer.js", "jquery-ImageContainer.ts", "photo-editor.js", "PhotoEditorReactUI.min.js", "PhotoEditorSDK.min.js" };
            }
        }

        public static void BuildRelease()
        {
            string buildDir = Constants.root + "build";
            DirectoryInfo di = new DirectoryInfo(buildDir);

            foreach (FileInfo file in di.GetFiles())
            {
                file.Delete();
            }
            foreach (DirectoryInfo dir in di.GetDirectories())
            {
                foreach (FileInfo file in dir.GetFiles())
                {
                    file.Delete();
                }
                dir.Delete(true);
            }


            DirectoryCopy(Constants.root + Constants.appRootFolder, buildDir, true);
            foreach (var file in SdkBuildFiles)
            {
                string pathToRead = Constants.root + Constants.appRootFolder + file.Path;
                var output = File.ReadAllText(pathToRead);
                string pathToSave = Constants.root + "build" +
                    @"\js\PhotoEditorSDK\" + Constants.versionToBuild + @"\js\" + file.SaveFileName;
                File.WriteAllText(pathToSave, (new Minifier()).MinifyJavaScript(output));
            }
        }

        private static void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs)
        {
            DirectoryInfo dir = new DirectoryInfo(sourceDirName);

            if (!dir.Exists)
            {
                throw new DirectoryNotFoundException(
                    "Source directory does not exist or could not be found: "
                    + sourceDirName);
            }

            DirectoryInfo[] dirs = dir.GetDirectories();
            if (!Directory.Exists(destDirName))
            {
                Directory.CreateDirectory(destDirName);
            }

            FileInfo[] files = dir.GetFiles();
            foreach (FileInfo file in files)
            {
                if (!ExtensionsToSkip.Any(x => x == file.Extension) && !FileNamesToSkip.Any(x => x == file.Name))
                {
                    string temppath = Path.Combine(destDirName, file.Name);
                    file.CopyTo(temppath, false);
                }
            }

            if (copySubDirs)
            {
                foreach (DirectoryInfo subdir in dirs)
                {
                    if (!FoldersToSkip.Any(x => x == subdir.Name))
                    {
                        string temppath = Path.Combine(destDirName, subdir.Name);
                        DirectoryCopy(subdir.FullName, temppath, copySubDirs);
                    }
                }
            }
        }

        class SdkBuildFile
        {
            public string Path { get; set; }
            public string SaveFileName { get; set; }
        }

    }
}

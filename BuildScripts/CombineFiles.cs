using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.IO;

namespace BuildScripts
{
    public class CombineFiles
    {
        static string root = AppDomain.CurrentDomain.BaseDirectory.Replace(@"\bin", string.Empty);
        public static string DESTINATION_FILE = root + @"content\js\photo-editor.js";
        public static string DESTINATION_FILE_MIN = root + @"content\js\photo-editor.min.js";

        public static List<string> Files
        {
            get
            {
                return new List<string> {
                     @"content\js\photo-editor\Globals\Version.js"
                    ,@"content\js\photo-editor\Globals\Texts.js"
                    ,@"content\js\photo-editor\Globals\Globals.js"
                    ,@"content\js\photo-editor\ExportedImage.js"
                    ,@"content\js\photo-editor\Actions\SDK\ActionsState.js"
                    ,@"content\js\photo-editor\Actions\SDK\BaseAction.js"
                    ,@"content\js\photo-editor\Actions\SDK\BasicActions.js"
                    ,@"content\js\photo-editor\Actions\ReactUI\ReactUIBase.js"
                    ,@"content\js\photo-editor\Actions\ReactUI\ReactUIOverlay.js"
                    ,@"content\js\photo-editor\Actions\SDKActions.js"
                    ,@"content\js\photo-editor\Html\HTMLButtonControl.js"
                    ,@"content\js\photo-editor\Html\HTMLControls.js"
                    ,@"content\js\photo-editor\Editor\ImageEditor.js"
                    ,@"content\js\photo-editor\ImageContainer.js"
                    ,@"content\js\jquery-ImageContainer.js"
                };
            }
        }

        public static void Combine()
        {
            string output = string.Empty;
            foreach (var file in Files)
            {
                output += File.ReadAllText(root + file) + Environment.NewLine + Environment.NewLine;
            }
            File.WriteAllText(DESTINATION_FILE, output);
            File.WriteAllText(DESTINATION_FILE_MIN, (new Minifier()).MinifyJavaScript(output));
        }
    }
}

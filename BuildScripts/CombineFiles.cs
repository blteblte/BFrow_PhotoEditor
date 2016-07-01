using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.IO;

namespace BuildScripts
{
    public class CombineFiles
    {
        public static string DESTINATION_FILE = Constants.root + Constants.appRootFolder + @"\js\photo-editor.js";
        public static string DESTINATION_FILE_MIN = Constants.root + Constants.appRootFolder + @"\js\photo-editor.min.js";

        public static List<string> Files
        {
            get
            {
                return new List<string> {
                     @"\js\photo-editor\Globals\Version.js"
                    ,@"\js\photo-editor\Globals\Texts.js"
                    ,@"\js\photo-editor\Handlers.js"
                    ,@"\js\photo-editor\Settings.js"
                    ,@"\js\photo-editor\Globals\Globals.js"
                    ,@"\js\photo-editor\ExportedImage.js"
                    ,@"\js\photo-editor\Actions\SDK\ActionsState.js"
                    ,@"\js\photo-editor\Actions\SDK\BaseAction.js"
                    ,@"\js\photo-editor\Actions\SDK\BasicActions.js"
                    ,@"\js\photo-editor\Actions\ReactUI\ReactUIBase.js"
                    ,@"\js\photo-editor\Actions\ReactUI\ReactUIOverlay.js"
                    ,@"\js\photo-editor\Actions\SDKActions.js"
                    ,@"\js\photo-editor\Html\HTMLButtonControl.js"
                    ,@"\js\photo-editor\Html\HTMLControls.js"
                    ,@"\js\photo-editor\Html\EventBinder.js"
                    ,@"\js\photo-editor\Editor\ImageEditor.js"
                };
            }
        }

        public static void Combine()
        {
            string output = string.Empty;
            foreach (var file in Files)
            {
                output += File.ReadAllText(Constants.root + Constants.appRootFolder + file)
                    + Environment.NewLine + Environment.NewLine;
            }
            File.WriteAllText(DESTINATION_FILE, output);
            File.WriteAllText(DESTINATION_FILE_MIN, (new Minifier()).MinifyJavaScript(output));
        }
    }
}

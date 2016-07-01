var PhotoEditor;
(function (PhotoEditor) {
    var Settings = (function () {
        function Settings() {
        }
        Settings.APP_ROOT_PATH = "content/";
        return Settings;
    })();
    PhotoEditor.Settings = Settings;
})(PhotoEditor || (PhotoEditor = {}));

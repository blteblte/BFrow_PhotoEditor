var PhotoEditor;
(function (PhotoEditor) {
    var Settings = (function () {
        function Settings() {
        }
        Settings.APP_ROOT_PATH = "content/";
        Settings.MIN_RESIZE_RATE = 5;
        return Settings;
    })();
    PhotoEditor.Settings = Settings;
})(PhotoEditor || (PhotoEditor = {}));

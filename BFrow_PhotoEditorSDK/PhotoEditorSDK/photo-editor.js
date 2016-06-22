var PhotoEditorFrame;
(function (PhotoEditorFrame) {
    var GET_URL_PARAM = "url";
    var CONTAINER_ID = "photo-editor";
    var EditorInstance = (function () {
        function EditorInstance() {
            this.editorIndex = 0;
            this.actions = null;
        }
        EditorInstance.prototype.LaunchEditor = function () {
            var _this = this;
            var imageUrl = this.GetImageUrl(GET_URL_PARAM);
            if (imageUrl !== null) {
                var editorInstance = new PhotoEditor.Editor.ImageEditor(CONTAINER_ID, this.editorIndex++, imageUrl);
                editorInstance.LoadEditor().then(function (actions) {
                    _this.actions = actions;
                });
            }
            else {
                throw (new Error("Image URL missing. Expected in 'GET' parameters as 'url'. Make sure its same origin."));
            }
        };
        EditorInstance.prototype.GetImageUrl = function (name, url) {
            if (url === void 0) { url = null; }
            if (url === null)
                url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
            if (!results)
                return null;
            if (!results[2])
                return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };
        return EditorInstance;
    })();
    PhotoEditorFrame.EditorInstance = EditorInstance;
})(PhotoEditorFrame || (PhotoEditorFrame = {}));
$(function () {
    (new PhotoEditorFrame.EditorInstance()).LaunchEditor();
});

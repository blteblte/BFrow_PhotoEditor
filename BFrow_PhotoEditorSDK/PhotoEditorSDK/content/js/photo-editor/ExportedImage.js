var PhotoEditor;
(function (PhotoEditor) {
    var ExportedImage = (function () {
        function ExportedImage(image, url) {
            this.image = image;
            this.url = url;
        }
        return ExportedImage;
    })();
    PhotoEditor.ExportedImage = ExportedImage;
})(PhotoEditor || (PhotoEditor = {}));

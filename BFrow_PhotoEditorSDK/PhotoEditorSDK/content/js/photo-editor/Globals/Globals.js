var PhotoEditor;
(function (PhotoEditor) {
    var Globals;
    (function (Globals) {
        var FlipDirection = (function () {
            function FlipDirection() {
            }
            FlipDirection.Vertical = 'v';
            FlipDirection.Horizontal = 'h';
            return FlipDirection;
        })();
        Globals.FlipDirection = FlipDirection;
        var RotateDirection = (function () {
            function RotateDirection() {
            }
            RotateDirection.Left = 'l';
            RotateDirection.Right = 'r';
            return RotateDirection;
        })();
        Globals.RotateDirection = RotateDirection;
        var ImageDimension = (function () {
            function ImageDimension() {
            }
            ImageDimension.W = "w";
            ImageDimension.H = "h";
            return ImageDimension;
        })();
        Globals.ImageDimension = ImageDimension;
        Globals._editorInstances = 0;
    })(Globals = PhotoEditor.Globals || (PhotoEditor.Globals = {}));
})(PhotoEditor || (PhotoEditor = {}));

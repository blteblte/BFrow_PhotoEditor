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
        var AdjustmentTypes = (function () {
            function AdjustmentTypes() {
            }
            AdjustmentTypes.Brightness = "brightness";
            AdjustmentTypes.Saturation = "saturation";
            AdjustmentTypes.Contrast = "contrast";
            AdjustmentTypes.Exposure = "exposure";
            AdjustmentTypes.Shadows = "shadows";
            AdjustmentTypes.Highlights = "highlights";
            return AdjustmentTypes;
        })();
        Globals.AdjustmentTypes = AdjustmentTypes;
        var Adjustments = (function () {
            function Adjustments(type, min, max, initial, multiplier) {
                this.type = type;
                this.min = min;
                this.max = max;
                this.initial = initial;
                this.multiplier = multiplier;
            }
            return Adjustments;
        })();
        Globals.Adjustments = Adjustments;
        var AdjustmentSettings = (function () {
            function AdjustmentSettings() {
            }
            AdjustmentSettings.GetAdjustmentSettings = function (type) {
                var lookup = {};
                for (var i = 0, len = this._adjustmentSettings.length; i < len; i++) {
                    lookup[this._adjustmentSettings[i].type] = this._adjustmentSettings[i];
                }
                return lookup[type];
            };
            AdjustmentSettings._adjustmentSettings = [
                new Adjustments(AdjustmentTypes.Brightness, -50, 50, 0, 100),
                new Adjustments(AdjustmentTypes.Saturation, 0, 200, 100, 100),
                new Adjustments(AdjustmentTypes.Contrast, 50, 150, 100, 100),
                new Adjustments(AdjustmentTypes.Exposure, -100, 100, 0, 100),
                new Adjustments(AdjustmentTypes.Shadows, 0, 100, 0, 100),
                new Adjustments(AdjustmentTypes.Highlights, 0, 100, 100, 100)
            ];
            return AdjustmentSettings;
        })();
        Globals.AdjustmentSettings = AdjustmentSettings;
        Globals._editorInstances = 0;
    })(Globals = PhotoEditor.Globals || (PhotoEditor.Globals = {}));
})(PhotoEditor || (PhotoEditor = {}));

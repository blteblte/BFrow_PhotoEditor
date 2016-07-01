
namespace PhotoEditor.Globals {

    export class FlipDirection {
        static Vertical: string = 'v';
        static Horizontal: string = 'h';
    }

    export class RotateDirection {
        static Left: string = 'l';
        static Right: string = 'r';
    }

    export class ImageDimension {
        static W: string = "w";
        static H: string = "h";
    }

    export class AdjustmentTypes {
        static Brightness: string = "brightness";
        static Saturation: string = "saturation";
        static Contrast: string = "contrast";
        static Exposure: string = "exposure";
        static Shadows: string = "shadows";
        static Highlights: string = "highlights";
    }

    export class Adjustments{
        constructor(
            public type: AdjustmentTypes,
            public min: number,
            public max: number,
            public initial: number,
            public multiplier: number
        ){}
    }

    export class AdjustmentSettings {

        private static _adjustmentSettings: Array<Adjustments> =
        [
            new Adjustments(AdjustmentTypes.Brightness, -50, 50, 0, 100),
            new Adjustments(AdjustmentTypes.Saturation, 0, 200, 100, 100),
            new Adjustments(AdjustmentTypes.Contrast, 50, 150, 100, 100),
            new Adjustments(AdjustmentTypes.Exposure, -100, 100, 0, 100),
            new Adjustments(AdjustmentTypes.Shadows, 0, 100, 0, 100),
            new Adjustments(AdjustmentTypes.Highlights, 0, 100, 100, 100)
        ];

        static GetAdjustmentSettings (type: AdjustmentTypes): Adjustments {
            var lookup = {};
            for (var i = 0, len = this._adjustmentSettings.length; i < len; i++) {
                lookup[<string>this._adjustmentSettings[i].type] = this._adjustmentSettings[i];
            }
            return lookup[<string>type];
        }
    }

    export var _editorInstances: number = 0;
    export var _editorDisposator: any;

}

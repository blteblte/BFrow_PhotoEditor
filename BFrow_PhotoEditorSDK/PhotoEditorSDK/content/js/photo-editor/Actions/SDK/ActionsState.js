var PhotoEditor;
(function (PhotoEditor) {
    var Actions;
    (function (Actions) {
        var SDK;
        (function (SDK) {
            var ActionState = (function () {
                /**
                * Initialize new actions state
                * @param {any} sdk - instance of PhotoEditorSDK
                */
                function ActionState(sdk) {
                    this.sdk = sdk;
                    this.rotation = 0;
                    this.flippedH = false;
                    this.flippedV = false;
                    this._lastExit = null;
                    this.originalZoom = sdk !== null ? sdk.getZoom() : 1;
                    this.RotationOperationStack = [];
                    this.FlipOperationStack = [];
                    this.FilterOperationStack = [];
                    var outputDimensions = sdk !== null ? sdk.getOutputDimensions() : null;
                    if (outputDimensions !== null) {
                        this.wToHRatio = outputDimensions.x / outputDimensions.y;
                        this.hToWRatio = outputDimensions.y / outputDimensions.x;
                    }
                    var inputDimensions = sdk !== null ? sdk.getInputDimensions() : null;
                    if (inputDimensions !== null) {
                        this.imageW = inputDimensions.x;
                        this.imageH = inputDimensions.y;
                        this.initialImageW = this.imageW;
                        this.initialImageH = this.imageH;
                    }
                }
                ActionState.prototype._lastExit = function () { };
                ;
                /**
                * Reset values to initial
                */
                ActionState.prototype.ResetState = function () {
                    this.RotationOperationStack = [];
                    this.FlipOperationStack = [];
                    this.rotation = 0;
                    this.flippedH = false;
                    this.flippedV = false;
                    this.imageW = this.initialImageW;
                    this.imageH = this.initialImageH;
                };
                /**
                * Reset rotation operation values to initial
                */
                ActionState.prototype.ClearRotationStack = function () {
                    var _this = this;
                    if (this.RotationOperationStack.length > 0) {
                        this.RotationOperationStack.forEach(function (v) {
                            _this.sdk.removeOperation(v);
                        });
                        this.RotationOperationStack = [];
                    }
                };
                /**
                * Reset flip operation values to initial
                */
                ActionState.prototype.ClearFlipStack = function () {
                    var _this = this;
                    if (this.FlipOperationStack.length > 0) {
                        this.FlipOperationStack.forEach(function (v) {
                            _this.sdk.removeOperation(v);
                        });
                        this.FlipOperationStack = [];
                    }
                };
                /**
                * Get image dimension ratio for specified dimension or reverse
                * @param {PhotoEditor.Globals.ImageDimension} dimension
                * @param {boolean} toRatio - set true to get ratio to specified dimension, false to get ratio from specified dimension
                * @return {number}
                */
                ActionState.prototype.getImageRatio = function (dimension, toRatio) {
                    if (toRatio === void 0) { toRatio = false; }
                    return dimension == PhotoEditor.Globals.ImageDimension.W
                        ? toRatio ? this.hToWRatio : this.wToHRatio
                        : toRatio ? this.wToHRatio : this.hToWRatio;
                };
                /**
                * Get image initial size for specified dimension
                * @param {PhotoEditor.Globals.ImageDimension} dimension
                * @return {number}
                */
                ActionState.prototype.getImageInitialSize = function (dimension) {
                    return dimension == PhotoEditor.Globals.ImageDimension.W
                        ? this.initialImageW
                        : this.initialImageH;
                };
                /**
                * Get image current size for specified dimension
                * @param {PhotoEditor.Globals.ImageDimension} dimension
                * @return {number}
                */
                ActionState.prototype.getImageCurrentSize = function (dimension) {
                    return dimension == PhotoEditor.Globals.ImageDimension.W
                        ? this.imageW
                        : this.imageH;
                };
                /**
                * Get number to apply to rotate operation
                * @param {number} add
                * @return {number}
                */
                ActionState.prototype._getRotation = function (add) {
                    this.rotation = this.rotation += add;
                    if (this.rotation === -360)
                        this.rotation = 0;
                    if (this.rotation === 360)
                        this.rotation = 0;
                    return this.rotation;
                };
                return ActionState;
            })();
            SDK.ActionState = ActionState;
        })(SDK = Actions.SDK || (Actions.SDK = {}));
    })(Actions = PhotoEditor.Actions || (PhotoEditor.Actions = {}));
})(PhotoEditor || (PhotoEditor = {}));

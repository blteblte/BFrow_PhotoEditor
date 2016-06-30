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
                    this.OrientationOperation = null;
                    this.FilterOperation = null;
                    this.AdjustmentOperation = null;
                    this._originalZoom = null;
                    //private _wToHRatio: number = null;
                    //get wToHRatio(): number {
                    //    if (this._wToHRatio === null && this.sdk !== null) {
                    //        let outputDimensions = this.sdk.getOutputDimensions();
                    //        this._wToHRatio = outputDimensions.x / outputDimensions.y;
                    //    }
                    //    return this._wToHRatio;
                    //}
                    //set wToHRatio(value: number) {
                    //    this._wToHRatio = value;
                    //}
                    //private _hToWRatio: number = null;
                    //get hToWRatio(): number {
                    //    if (this._hToWRatio === null && this.sdk !== null) {
                    //        let outputDimensions = this.sdk.getOutputDimensions();
                    //        this._hToWRatio = outputDimensions.y / outputDimensions.x;
                    //    }
                    //    return this._hToWRatio;
                    //}
                    //set hToWRatio(value: number) {
                    //    this._hToWRatio = value;
                    //}
                    this._wToHRatio = null;
                    this._hToWRatio = null;
                    this._initialImageW = null;
                    this._initialImageH = null;
                    this._imageW = null;
                    this._imageH = null;
                    //orientation state
                    this.rotation = 0;
                    this.flippedH = false;
                    this.flippedV = false;
                    //addjustments state
                    this.brightnessValue = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(PhotoEditor.Globals.AdjustmentTypes.Brightness).initial;
                    this.saturationValue = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(PhotoEditor.Globals.AdjustmentTypes.Saturation).initial;
                    this.contrastValue = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(PhotoEditor.Globals.AdjustmentTypes.Contrast).initial;
                    this.exposureValue = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(PhotoEditor.Globals.AdjustmentTypes.Exposure).initial;
                    this.shadowsValue = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(PhotoEditor.Globals.AdjustmentTypes.Shadows).initial;
                    this.highlightsValue = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(PhotoEditor.Globals.AdjustmentTypes.Highlights).initial;
                    this.adjustStateSaved = false;
                }
                Object.defineProperty(ActionState.prototype, "originalZoom", {
                    get: function () {
                        if (this._originalZoom === null && this.sdk !== null) {
                            this._originalZoom = this.sdk.getZoom();
                        }
                        return this._originalZoom;
                    },
                    set: function (value) {
                        this._originalZoom = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ActionState.prototype, "wToHRatio", {
                    get: function () {
                        if (this._wToHRatio === null && this.sdk !== null) {
                            var outputDimensions = this.sdk.getInputDimensions();
                            this._wToHRatio = outputDimensions.x / outputDimensions.y;
                        }
                        return this._wToHRatio;
                    },
                    set: function (value) {
                        this._wToHRatio = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ActionState.prototype, "hToWRatio", {
                    get: function () {
                        if (this._hToWRatio === null && this.sdk !== null) {
                            var outputDimensions = this.sdk.getInputDimensions();
                            this._hToWRatio = outputDimensions.y / outputDimensions.x;
                        }
                        return this._hToWRatio;
                    },
                    set: function (value) {
                        this._hToWRatio = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ActionState.prototype, "initialImageW", {
                    get: function () {
                        if (this._initialImageW === null && this.sdk !== null) {
                            this._initialImageW = this.sdk.getInputDimensions().x;
                        }
                        return this._initialImageW;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ActionState.prototype, "initialImageH", {
                    get: function () {
                        if (this._initialImageH === null && this.sdk !== null) {
                            this._initialImageH = this.sdk.getInputDimensions().y;
                        }
                        return this._initialImageH;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ActionState.prototype, "imageW", {
                    get: function () {
                        if (this._imageW === null) {
                            this._imageW = this.initialImageW;
                        }
                        return this._imageW;
                    },
                    set: function (value) {
                        this._imageW = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ActionState.prototype, "imageH", {
                    get: function () {
                        if (this._imageH === null) {
                            this._imageH = this.initialImageH;
                        }
                        return this._imageH;
                    },
                    set: function (value) {
                        this._imageH = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                * Reset values to initial
                */
                ActionState.prototype.ResetState = function () {
                    this.rotation = 0;
                    this.flippedH = false;
                    this.flippedV = false;
                    this.imageW = this.initialImageW;
                    this.imageH = this.initialImageH;
                    this.brightnessValue = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(PhotoEditor.Globals.AdjustmentTypes.Brightness).initial;
                    this.saturationValue = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(PhotoEditor.Globals.AdjustmentTypes.Saturation).initial;
                    this.contrastValue = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(PhotoEditor.Globals.AdjustmentTypes.Contrast).initial;
                    this.exposureValue = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(PhotoEditor.Globals.AdjustmentTypes.Exposure).initial;
                    this.shadowsValue = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(PhotoEditor.Globals.AdjustmentTypes.Shadows).initial;
                    this.highlightsValue = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(PhotoEditor.Globals.AdjustmentTypes.Highlights).initial;
                };
                ActionState.prototype.ResetOrientationState = function () {
                    this.OrientationOperation = null;
                    this.rotation = 0;
                    this.flippedV = false;
                    this.flippedH = false;
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

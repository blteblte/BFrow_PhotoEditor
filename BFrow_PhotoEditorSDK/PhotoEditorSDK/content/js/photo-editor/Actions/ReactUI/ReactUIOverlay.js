var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PhotoEditor;
(function (PhotoEditor) {
    var Actions;
    (function (Actions) {
        var ReactUI;
        (function (ReactUI) {
            var ReactUIOverlay = (function (_super) {
                __extends(ReactUIOverlay, _super);
                function ReactUIOverlay(sdk, editor, containerId, image) {
                    _super.call(this, sdk, editor, containerId, image);
                }
                ReactUIOverlay.prototype.StartCropping = function (initSubControls) {
                    var _this = this;
                    if (typeof (initSubControls) === 'function')
                        initSubControls();
                    else
                        this.init(this.SubmitCrop, null);
                    this.ResetOrientation(function () {
                        setTimeout(function () {
                            $(_this._CropInitButtonSelector).click();
                            _this._isInControl = true;
                        }, 200);
                    });
                };
                ReactUIOverlay.prototype.CancelCrop = function () {
                    $(this._CropCancelSelector).click();
                    this._isInControl = false;
                };
                ReactUIOverlay.prototype.SubmitCrop = function () {
                    var _this = this;
                    $(this._CropSubmitSelector).click();
                    this._isInControl = false;
                    setTimeout(function () { _this.state.originalZoom = _this.sdk.getZoom(); }, 100);
                };
                ReactUIOverlay.prototype.CropCustom = function () {
                    this._launchControl("custom", this._CropInitButtonSelector);
                };
                ReactUIOverlay.prototype.CropSquare = function () {
                    this._launchControl("square", this._CropInitButtonSelector);
                };
                ReactUIOverlay.prototype.Crop4to3 = function () {
                    this._launchControl("4-3", this._CropInitButtonSelector);
                };
                ReactUIOverlay.prototype.Crop16to6 = function () {
                    this._launchControl("16-9", this._CropInitButtonSelector);
                };
                ReactUIOverlay.prototype.SubmitAdjust = function () {
                    $(this._AdjustSubmitSelector).click();
                    this._isInControl = false;
                };
                ReactUIOverlay.prototype.StartBrightness = function () {
                    this.init(this.SubmitAdjust);
                    this._launchControl("Brightness", this._AdjustInitButtonSelector);
                };
                ReactUIOverlay.prototype.StartSaturation = function () {
                    this.init(this.SubmitAdjust);
                    this._launchControl("Saturation", this._AdjustInitButtonSelector);
                };
                ReactUIOverlay.prototype.StartContrast = function () {
                    this.init(this.SubmitAdjust);
                    this._launchControl("Contrast", this._AdjustInitButtonSelector);
                };
                //v 3.3.0
                ReactUIOverlay.prototype.StartExposure = function () {
                    this.init(this.SubmitAdjust);
                    this._launchControl("Exposure", this._AdjustInitButtonSelector);
                };
                ReactUIOverlay.prototype.StartShadows = function () {
                    this.init(this.SubmitAdjust);
                    this._launchControl("Shadows", this._AdjustInitButtonSelector);
                };
                ReactUIOverlay.prototype.StartHighlights = function () {
                    this.init(this.SubmitAdjust);
                    this._launchControl("Highlights", this._AdjustInitButtonSelector);
                };
                //
                ReactUIOverlay.prototype.StartFilter = function (filter) {
                    this.init(this.SubmitFilters, null);
                    this._launchControl(filter, this._FiltersInitButtonSelector);
                };
                ReactUIOverlay.prototype.SubmitFilters = function () {
                    $(this._FiltersSubmitSelector).click();
                    this._isInControl = false;
                };
                return ReactUIOverlay;
            })(ReactUI.ReactUIBase);
            ReactUI.ReactUIOverlay = ReactUIOverlay;
        })(ReactUI = Actions.ReactUI || (Actions.ReactUI = {}));
    })(Actions = PhotoEditor.Actions || (PhotoEditor.Actions = {}));
})(PhotoEditor || (PhotoEditor = {}));

var PhotoEditor;
(function (PhotoEditor) {
    var Globals;
    (function (Globals) {
        //export var sdkVersionFolder: string = "3.3.0"
        Globals.sdkVersionFolder = "pre_3.4.0";
    })(Globals = PhotoEditor.Globals || (PhotoEditor.Globals = {}));
})(PhotoEditor || (PhotoEditor = {}));


var PhotoEditor;
(function (PhotoEditor) {
    var Globals;
    (function (Globals) {
        Globals.Texts = {
            Nav: {
                EditNextPicture: "EDIT NEXT PICTURE",
                Back: "BACK",
                UploadAll: "DONE"
            },
            EditorNav: {
                PictureSettings: "PICTURE SETTINGS",
                FilterGalery: "FILTER GALERY",
                ColorSettings: "COLOR SETTINGS"
            },
            Buttons: {
                RotateLeft: "Rotate Left",
                RotateRight: "Rotate Right",
                FlipH: "Flip Hor",
                FlipV: "Flip Ver",
                Crop: "Crop",
                CropCustom: "Custom",
                CropSquare: "Square",
                Crop4to3: "4:3",
                Crop16to9: "16:9",
                Brightness: "Brightness",
                Saturation: "Saturation",
                Contrast: "Contrast",
                Exposure: "Exposure",
                Shadows: "Shadows",
                Highlights: "Highlights",
                Resset: "Reset",
                Resize: "Resize",
                FitToScreen: "Fit To Page",
                LockRatio: "Lock Ratio",
                Cancel: "Cancel",
                Submit: "Submit",
                Back: "Back",
                Done: "Done"
            },
            Inputs: {
                ResizeWidthPlch: "width...",
                ResizeHeightPlch: "height..."
            }
        };
    })(Globals = PhotoEditor.Globals || (PhotoEditor.Globals = {}));
})(PhotoEditor || (PhotoEditor = {}));


var PhotoEditor;
(function (PhotoEditor) {
    var Handlers;
    (function (Handlers) {
    })(Handlers = PhotoEditor.Handlers || (PhotoEditor.Handlers = {}));
})(PhotoEditor || (PhotoEditor = {}));


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
                for (var i = 0, len = AdjustmentSettings._adjustmentSettings.length; i < len; i++) {
                    lookup[AdjustmentSettings._adjustmentSettings[i].type] = AdjustmentSettings._adjustmentSettings[i];
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
                    this.CurrentFilter = null;
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
                    var adj = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings;
                    this.brightnessValue = adj(PhotoEditor.Globals.AdjustmentTypes.Brightness).initial;
                    this.saturationValue = adj(PhotoEditor.Globals.AdjustmentTypes.Saturation).initial;
                    this.contrastValue = adj(PhotoEditor.Globals.AdjustmentTypes.Contrast).initial;
                    this.exposureValue = adj(PhotoEditor.Globals.AdjustmentTypes.Exposure).initial;
                    this.shadowsValue = adj(PhotoEditor.Globals.AdjustmentTypes.Shadows).initial;
                    this.highlightsValue = adj(PhotoEditor.Globals.AdjustmentTypes.Highlights).initial;
                };
                ActionState.prototype.ResetOrientationState = function () {
                    this.OrientationOperation = null;
                    this.rotation = 0;
                    this.flippedV = false;
                    this.flippedH = false;
                };
                ActionState.prototype.ResetAdjustmentState = function () {
                    var adj = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings;
                    this.brightnessValue = adj(PhotoEditor.Globals.AdjustmentTypes.Brightness).initial;
                    this.saturationValue = adj(PhotoEditor.Globals.AdjustmentTypes.Saturation).initial;
                    this.contrastValue = adj(PhotoEditor.Globals.AdjustmentTypes.Contrast).initial;
                    this.exposureValue = adj(PhotoEditor.Globals.AdjustmentTypes.Exposure).initial;
                    this.shadowsValue = adj(PhotoEditor.Globals.AdjustmentTypes.Shadows).initial;
                    this.highlightsValue = adj(PhotoEditor.Globals.AdjustmentTypes.Highlights).initial;
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


var PhotoEditor;
(function (PhotoEditor) {
    var Actions;
    (function (Actions) {
        var SDK;
        (function (SDK) {
            var BaseAction = (function () {
                function BaseAction(reactUI, sdk, editor, containerId, image) {
                    var _this = this;
                    this.reactUI = reactUI;
                    this.sdk = sdk;
                    this.editor = editor;
                    this.containerId = containerId;
                    this.image = image;
                    this.sdk = sdk;
                    this.editor = editor;
                    this.containerId = containerId;
                    this.editorIndex = sdk !== null ? PhotoEditor.Globals._editorInstances++ : -1;
                    this.state = new SDK.ActionState(sdk);
                    this._lastExit = null;
                    if (sdk !== null) {
                        var inresize = false;
                        window.onresize = function () {
                            if (!inresize)
                                setTimeout(function () {
                                    _this.state.originalZoom = sdk.getZoom();
                                    inresize = false;
                                }, 1000);
                            inresize = true;
                        };
                    }
                }
                BaseAction.prototype._lastExit = function () { };
                ;
                /**
                * Zoom editor to fit the image to screen
                * @param {Function} callback
                * @return {Number}
                */
                BaseAction.prototype.FitToScreen = function (callback) {
                    var _outputDimensions = this.sdk.getOutputDimensions();
                    var _canvas = this.sdk.getCanvas();
                    //let $inner = $('.pesdk-react-canvasControls.pesdk-react-canvasControls__innerContainer');
                    //let _canvas = { height: $inner.height(), width: $inner.width() };
                    //console.log(this.state.originalZoom);
                    var ratio = 1;
                    if (_outputDimensions.y > _canvas.height) {
                        ratio = parseFloat(_canvas.height) / _outputDimensions.y;
                    }
                    if (_outputDimensions.x > _canvas.width) {
                        var assignable = parseFloat(_canvas.width) / _outputDimensions.x;
                        ratio = assignable < ratio ? assignable : ratio;
                    }
                    var zoomRatioToSet = this.state.originalZoom * ratio;
                    this.sdk.setZoom(zoomRatioToSet);
                    this.sdk.render();
                    //window.dispatchEvent(new Event('resize'));
                    if (typeof (callback) === 'function')
                        callback();
                    return zoomRatioToSet;
                };
                BaseAction.prototype.TriggerFitToScreen = function () {
                    window.dispatchEvent(new Event('resize'));
                };
                /**
                * Reset orientation to its original state
                * @param {Function} callback
                * @param {boolean} render
                */
                BaseAction.prototype.ResetOrientation = function (callback, render) {
                    if (render === void 0) { render = true; }
                    var resolve = function () { if (typeof (callback) === 'function')
                        callback(); };
                    if (this.state.OrientationOperation !== null) {
                        this.sdk.removeOperation(this.state.OrientationOperation);
                        this.state.ResetOrientationState();
                        if (render)
                            this.FitToScreen(callback);
                        else
                            resolve();
                    }
                    else {
                        resolve();
                    }
                };
                /**
                * Reset sdk. Clears the operation stack and fits image to screen
                */
                BaseAction.prototype.Reset = function () {
                    var _this = this;
                    this.init(null, function () {
                        _this.state.ResetState();
                        _this.sdk.reset();
                        _this.sdk.setImage(_this.image);
                        window.dispatchEvent(new Event('resize'));
                    });
                };
                BaseAction.prototype.Export = function (format, callback, dispose) {
                    var _this = this;
                    this.init(null, function () {
                        _this.sdk.render().then(function () {
                            _this.sdk.export(PhotoEditorSDK.RenderType.DATAURL, format, 1)
                                .then(function (image) {
                                callback(new PhotoEditor.ExportedImage(image, _this.image.src));
                                if (!!dispose) {
                                    setTimeout(function () { _this.DisposeEditor(true); }, 1000);
                                }
                            });
                        });
                    });
                };
                BaseAction.prototype.DisposeEditor = function (disposeSdk) {
                    if (disposeSdk === void 0) { disposeSdk = false; }
                    $('.pesdk-react-modals__button').click();
                    if (disposeSdk)
                        this.reactUI.dispose();
                    var id = "#" + this.containerId + "-editor";
                    $(id).remove();
                    $('.photo-editor-ui_container').remove();
                    PhotoEditor.Html.HTMLControls.HideLoader();
                    console.log(id + " disposed");
                    PhotoEditor.Globals._editorDisposator = null;
                };
                /**
                * Executes any exit functions and assigns new one if any
                * @param {Function} newExit
                * @param {Function} callback
                */
                BaseAction.prototype.init = function (newExit, callback) {
                    if (newExit === void 0) { newExit = null; }
                    if (callback === void 0) { callback = null; }
                    if (typeof (this._lastExit) === 'function')
                        this._lastExit();
                    this._lastExit = newExit;
                    setTimeout(function () { if (typeof (callback) === 'function')
                        callback(); }, 100);
                };
                BaseAction.prototype.ResizeImage = function (w, h, callback, render) {
                    var _this = this;
                    if (callback === void 0) { callback = null; }
                    if (render === void 0) { render = true; }
                    this.ResetOrientation(function () {
                        _this.init(null, function () {
                            _this.RemoveCrop();
                            _this.state.imageW = w;
                            _this.state.imageH = h;
                            var dimensions = new PhotoEditorSDK.Math.Vector2(w, h);
                            _this.sdk.setImage(_this.sdk.getImage(), _this.sdk.getExif(), dimensions);
                            if (render)
                                _this.FitToScreen(callback);
                            else if (typeof (callback) === 'function')
                                callback();
                        });
                    }, false);
                };
                BaseAction.prototype.ResetPictureSettings = function () {
                    var _this = this;
                    this.init(null, function () {
                        _this.ResetOrientation(function () {
                            _this.ResizeImage(_this.state.initialImageW, _this.state.initialImageH, function () {
                                _this.RemoveCrop();
                                _this.TriggerFitToScreen();
                            }, false);
                        }, false);
                    });
                };
                BaseAction.prototype.RemoveCrop = function () {
                    var _this = this;
                    var operationStack = this.editor.getOperationsStack();
                    operationStack.forEach(function (v) {
                        if (v instanceof PhotoEditorSDK.Operations.CropOperation) {
                            _this.editor.removeOperation(v);
                        }
                    });
                };
                /**
                * Gets filter image by filter name
                * @param {string} filterName
                * @return {string}
                */
                BaseAction.prototype.getFilterImageByName = function (filterName) {
                    var path = PhotoEditor.Settings.APP_ROOT_PATH + "img/filters/";
                    return path + filterName + '.png';
                };
                return BaseAction;
            })();
            SDK.BaseAction = BaseAction;
        })(SDK = Actions.SDK || (Actions.SDK = {}));
    })(Actions = PhotoEditor.Actions || (PhotoEditor.Actions = {}));
})(PhotoEditor || (PhotoEditor = {}));


var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PhotoEditor;
(function (PhotoEditor) {
    var Actions;
    (function (Actions) {
        var SDK;
        (function (SDK) {
            var BasicActions = (function (_super) {
                __extends(BasicActions, _super);
                function BasicActions(reactUI, sdk, editor, containerId, image) {
                    _super.call(this, reactUI, sdk, editor, containerId, image);
                    this.reactUI = reactUI;
                }
                BasicActions.prototype.Rotate = function (direction) {
                    var _this = this;
                    this.init(null, function () {
                        if (_this.state.OrientationOperation == null) {
                            _this.state.OrientationOperation = new PhotoEditorSDK.Operations.OrientationOperation(_this.sdk, {});
                            //this.sdk.addOperation(this.state.OrientationOperation);
                            _this.editor.addOperation(_this.state.OrientationOperation);
                        }
                        var rotateTo = direction === PhotoEditor.Globals.RotateDirection.Left ? -90 : 90;
                        var newRotation = _this.state._getRotation(rotateTo);
                        _this.state.OrientationOperation.setRotation(newRotation);
                        console.log("Canvas W = " + _this.sdk.getCanvas().width, "Canvas H = " + _this.sdk.getCanvas().height);
                        //console.log(this.state.OrientationOperation);
                        _this.FitToScreen(null);
                    });
                };
                BasicActions.prototype.Flip = function (dir) {
                    var _this = this;
                    if (this.state.OrientationOperation == null) {
                        this.state.OrientationOperation = new PhotoEditorSDK.Operations.OrientationOperation(this.sdk, {});
                        this.editor.addOperation(this.state.OrientationOperation);
                    }
                    var flipH = function () {
                        _this.state.flippedH = !_this.state.flippedH;
                        _this.state.OrientationOperation.setFlipHorizontally(_this.state.flippedH);
                    };
                    var flipV = function () {
                        _this.state.flippedV = !_this.state.flippedV;
                        _this.state.OrientationOperation.setFlipVertically(_this.state.flippedV);
                    };
                    if (dir === PhotoEditor.Globals.FlipDirection.Horizontal && (this.state.rotation === 0 || this.state.rotation == 180))
                        flipH();
                    else if (dir === PhotoEditor.Globals.FlipDirection.Horizontal)
                        flipV();
                    if (dir === PhotoEditor.Globals.FlipDirection.Vertical && (this.state.rotation === 90 || this.state.rotation == 270))
                        flipH();
                    else if (dir === PhotoEditor.Globals.FlipDirection.Vertical)
                        flipV();
                    this.sdk.render();
                };
                BasicActions.prototype.Adjust = function (adjustmentType, value, render, callback) {
                    if (render === void 0) { render = true; }
                    if (callback === void 0) { callback = null; }
                    if (this.state.AdjustmentOperation == null) {
                        this.state.AdjustmentOperation = new PhotoEditorSDK.Operations.AdjustmentsOperation(this.sdk, {});
                        this.editor.addOperation(this.state.AdjustmentOperation);
                    }
                    var settings = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(adjustmentType);
                    switch (adjustmentType) {
                        case PhotoEditor.Globals.AdjustmentTypes.Brightness:
                            this.state.AdjustmentOperation.setBrightness(value);
                            this.state.brightnessValue = value * settings.multiplier;
                            break;
                        case PhotoEditor.Globals.AdjustmentTypes.Saturation:
                            //test - rerender with same value
                            //BUG in Microsoft Edge -> developers of SDK notified
                            //TODO: remove
                            if ($('#slider-force').val() == "1")
                                value = parseFloat($('#f-value').val());
                            console.log("passed value to AdjustmentOperation.setSaturation(value): -----> ", value, "float");
                            //
                            this.state.AdjustmentOperation.setSaturation(value);
                            this.state.saturationValue = value * settings.multiplier;
                            break;
                        case PhotoEditor.Globals.AdjustmentTypes.Contrast:
                            this.state.AdjustmentOperation.setContrast(value);
                            this.state.contrastValue = value * settings.multiplier;
                            break;
                        case PhotoEditor.Globals.AdjustmentTypes.Exposure:
                            this.state.AdjustmentOperation.setExposure(value);
                            this.state.exposureValue = value * settings.multiplier;
                            break;
                        case PhotoEditor.Globals.AdjustmentTypes.Shadows:
                            this.state.AdjustmentOperation.setShadows(value);
                            this.state.shadowsValue = value * settings.multiplier;
                            break;
                        case PhotoEditor.Globals.AdjustmentTypes.Highlights:
                            this.state.AdjustmentOperation.setHighlights(value);
                            this.state.highlightsValue = value * settings.multiplier;
                            break;
                    }
                    if (render)
                        this.sdk.render();
                    if (typeof (callback) === 'function')
                        callback();
                };
                BasicActions.prototype.ResetColorSettings = function () {
                    var _this = this;
                    this.init(null, function () {
                        if (_this.state.AdjustmentOperation !== null) {
                            _this.editor.removeOperation(_this.state.AdjustmentOperation);
                            _this.state.AdjustmentOperation = null;
                            _this.state.ResetAdjustmentState();
                            _this.sdk.render();
                        }
                    });
                };
                BasicActions.prototype.GenerateFilterIcons = function () {
                    var _this = this;
                    var filters = [];
                    $.each(PhotoEditorSDK.Filters, function (i, filter) {
                        if (filter.identifier !== 'k1'
                            && filter.identifier !== 'k2'
                            && filter.identifier !== 'k6'
                            && filter.identifier !== 'kdynamic'
                            && filter.identifier !== 'morning'
                            && filter.identifier !== 'lut') {
                            var $filterContainer = $("<div class=\"photo-editor-filter-item " + filter.identifier + "\"></div>").click(function () {
                                if (_this.state.FilterOperation == null) {
                                    _this.state.FilterOperation = new PhotoEditorSDK.Operations.FilterOperation(_this.sdk, {});
                                    _this.editor.addOperation(_this.state.FilterOperation);
                                }
                                if (_this.state.CurrentFilter === null || _this.state.CurrentFilter.name !== filter.name) {
                                    _this.state.CurrentFilter = filter;
                                    _this.state.FilterOperation.setFilter(new filter());
                                    _this.sdk.render();
                                }
                            });
                            var $image = $("<img src=\"" + _this.getFilterImageByName(filter.name) + "\" alt=\"\" />");
                            var $nameItem = $("<div>" + filter.displayName + "</div>");
                            $filterContainer.append($image, $nameItem);
                            filters.push($filterContainer);
                        }
                    });
                    return filters;
                };
                return BasicActions;
            })(SDK.BaseAction);
            SDK.BasicActions = BasicActions;
        })(SDK = Actions.SDK || (Actions.SDK = {}));
    })(Actions = PhotoEditor.Actions || (PhotoEditor.Actions = {}));
})(PhotoEditor || (PhotoEditor = {}));


/* React UI */
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
            var ReactUIBase = (function (_super) {
                __extends(ReactUIBase, _super);
                function ReactUIBase(reactUI, sdk, editor, containerId, image) {
                    _super.call(this, reactUI, sdk, editor, containerId, image);
                    this.reactUI = reactUI;
                    this._isInControl = false;
                    this._controlContainer = "#" + containerId + " .pesdk-react-controls.pesdk-react-controls__container.pesdk-react-controls__container__row .pesdk-react-controls__table > .pesdk-react-controls__cell.pesdk-react-controls__cell--list";
                    this._buttonContainer = "#" + containerId + "-editor > div > div:nth-child(3) > div.pesdk-react-editorScreen > div.pesdk-react-controls.pesdk-react-controls__container.pesdk-react-controls__container__row > div > div > div";
                    this._CropInitButtonSelector = this._controlContainer + " .pesdk-react-controls__list__item:nth-child(1) > div";
                    this._CropCancelSelector = this._buttonContainer + " > div:nth-child(1) > div";
                    this._CropSubmitSelector = this._buttonContainer + " > div:nth-child(3) > div";
                    //this._AdjustInitButtonSelector = '#' + containerId +
                    //    ' .pesdk-react-controls__button__icon[data-reactid=".'
                    //    + this.editorIndex
                    //    + '.1.1.2.0.0.0.0.0.0.$adjustments.0.0"]';
                    //this._AdjustSubmitSelector = '#' + containerId +
                    //    ' .pesdk-react-controls__largeButton__icon[data-reactid=".'
                    //    + this.editorIndex
                    //    + '.1.1.2.0.0.1.0.0.0"]';
                    //this._FiltersInitButtonSelector = '#' + containerId +
                    //    ' .pesdk-react-controls__button__icon[data-reactid=".'
                    //    + this.editorIndex
                    //    + '.1.1.2.0.0.0.0.0.0.$filter.0.0"]';
                    //this._FiltersSubmitSelector = '#' + containerId +
                    //    ' .pesdk-react-controls__largeButton__icon[data-reactid=".'
                    //    + this.editorIndex
                    //    + '.1.1.2.0.0.1.0.0.0"]';
                    //this._CropInitButtonSelector =
                    //    `#${this.containerId} .pesdk-react-controls__button__icon[data-reactid=".${this.editorIndex}.1.1.2.0.0.0.0.0.0.$crop.0.0"]`;
                    //this._CropCancelSelector =
                    //    `#${this.containerId} .pesdk-react-controls__largeButton__icon[data-reactid=".${this.editorIndex}.1.1.2.0.0.0.0.0.0"]`;
                    //this._CropSubmitSelector =
                    //    `#${this.containerId} .pesdk-react-controls__largeButton__icon[data-reactid=".${this.editorIndex}.1.1.2.0.0.0.2.0.0"]`;
                }
                ReactUIBase.prototype._createSubControls = function (buttonControls, $target, callback) {
                    if (callback === void 0) { callback = null; }
                    $("#" + this.containerId + " .photo-editor-ui_controls-container, #" + this.containerId + " .slick-dots").css({ opacity: "0", height: "0" });
                    var $subActionsContainer = $("<div class=\"photo-editor-ui_sub-controls-container\"></div>");
                    var $inner = $("<div class=\"photo-editor-ui_sub-controls-inner\"></div>");
                    buttonControls.forEach(function (v, i) {
                        $inner.append(v);
                    });
                    $target.append($subActionsContainer.append($inner));
                    if (typeof (callback) === 'function')
                        callback();
                };
                ReactUIBase.prototype._disposeSubControls = function () {
                    $("#" + this.containerId + " .photo-editor-ui_controls-container, #" + this.containerId + " .slick-dots").css({ opacity: "1", height: "auto" });
                    $("#" + this.containerId + " .photo-editor-ui_sub-controls-container").remove();
                };
                ReactUIBase.prototype._launchControl = function (operation, intitSelector) {
                    var _this = this;
                    if (!this._isInControl) {
                        $(intitSelector).click();
                        this._isInControl = true;
                        setTimeout(function () {
                            $(_this._findControl(operation)).click();
                        }, 100);
                    }
                    else {
                        $(this._findControl(operation)).click();
                    }
                };
                /**
                * Gets ReactUI jQuery selector for ReactUI control
                * @param {string} control - control identifier
                * @return {string}
                */
                ReactUIBase.prototype._findControl = function (control) {
                    var selector;
                    var $item = $("#" + this.containerId + " .pesdk-react-controls__list .pesdk-react-controls__list__item[data-reactid*=" + control.toLowerCase() + "]");
                    var dataid = $item.attr('data-reactid');
                    selector = "#" + this.containerId + " .pesdk-react-controls__list__item[data-reactid=\"" + dataid + "\"] .pesdk-react-controls__button";
                    //console.log(control, selector);
                    return selector;
                };
                return ReactUIBase;
            })(Actions.SDK.BasicActions);
            ReactUI.ReactUIBase = ReactUIBase;
        })(ReactUI = Actions.ReactUI || (Actions.ReactUI = {}));
    })(Actions = PhotoEditor.Actions || (PhotoEditor.Actions = {}));
})(PhotoEditor || (PhotoEditor = {}));


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
                function ReactUIOverlay(reactUI, sdk, editor, containerId, image) {
                    _super.call(this, reactUI, sdk, editor, containerId, image);
                    this.reactUI = reactUI;
                }
                ReactUIOverlay.prototype.StartCropping = function (initSubControls) {
                    var _this = this;
                    if (typeof (initSubControls) === 'function')
                        initSubControls();
                    else
                        this.init(this.SubmitCrop, null);
                    //this.ResetOrientation(() => {
                    setTimeout(function () {
                        $(_this._CropInitButtonSelector).click();
                        _this._isInControl = true;
                    }, 200);
                    //});
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


var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PhotoEditor;
(function (PhotoEditor) {
    var Actions;
    (function (Actions) {
        var SDKActions = (function (_super) {
            __extends(SDKActions, _super);
            function SDKActions(editor, internalInstance, containerId, image) {
                //console.log(internalInstance);
                var _editor = editor;
                var _internalEditor = internalInstance !== null
                    ? internalInstance._component._reactInternalInstance._instance.refs.editorScreen._editor
                    : null;
                var _sdk = _internalEditor !== null
                    ? _internalEditor.getSDK()
                    : null;
                //console.log(editor);
                //console.log(_internalEditor);
                //console.log(_sdk);
                _super.call(this, _editor, _sdk, _internalEditor, containerId, image);
            }
            return SDKActions;
        })(Actions.ReactUI.ReactUIOverlay);
        Actions.SDKActions = SDKActions;
    })(Actions = PhotoEditor.Actions || (PhotoEditor.Actions = {}));
})(PhotoEditor || (PhotoEditor = {}));


var PhotoEditor;
(function (PhotoEditor) {
    var Html;
    (function (Html) {
        var HTMLButtonControl = (function () {
            function HTMLButtonControl(text, cssClass, onclick, tagName, placeholder) {
                if (text === void 0) { text = ''; }
                if (tagName === void 0) { tagName = null; }
                if (placeholder === void 0) { placeholder = ''; }
                this.text = text;
                this.cssClass = cssClass;
                this.onclick = onclick;
                this.tagName = tagName;
                this.placeholder = placeholder;
            }
            return HTMLButtonControl;
        })();
        Html.HTMLButtonControl = HTMLButtonControl;
    })(Html = PhotoEditor.Html || (PhotoEditor.Html = {}));
})(PhotoEditor || (PhotoEditor = {}));


var PhotoEditor;
(function (PhotoEditor) {
    var Html;
    (function (Html) {
        //TODO: use interface
        var HTMLControls = (function () {
            function HTMLControls() {
            }
            HTMLControls.GetButtonContol = function (buttonControl) {
                var tag = buttonControl.tagName === null ? this.DEFAULT_DOM_ELEMENT : buttonControl.tagName;
                if (tag === 'input') {
                    return $("<" + tag + " type=\"text\" class=\"" + this.CSS_PREFIX + buttonControl.cssClass + "\" value=\"" + buttonControl.text + "\" placeholder=\"" + buttonControl.placeholder + "\" />")
                        .click(function () { buttonControl.onclick($(this)); });
                }
                else {
                    return $("<" + tag + " class=\"" + this.CSS_PREFIX + buttonControl.cssClass + " main-controls-button\">\n    <img src=\"" + PhotoEditor.Settings.APP_ROOT_PATH + "img/buttons/" + buttonControl.cssClass + ".png\" alt=\"\" />\n    <span>" + buttonControl.text + "</span>\n</" + tag + ">")
                        .click(function () { buttonControl.onclick($(this)); });
                }
            };
            HTMLControls.GetEditorContainer = function (containerselector) {
                return $("<div id=\"" + containerselector + "\" class=\"photo-editor-instance-container\"></div>");
            };
            HTMLControls.GetSlider = function () {
                return $("<div id=\"photo-editor-ui_slider\"></div>");
            };
            HTMLControls.GetSliderStaticBox = function () {
                return $('<span class="photo-editor-ui_slider-static-box">0</span>');
            };
            HTMLControls.ShowLoader = function ($appendTo, text) {
                $appendTo.append(this._getLoader(text));
            };
            HTMLControls.HideLoader = function () {
                this.$loader.remove();
            };
            HTMLControls._getLoader = function (text) {
                return this.$loader = $("<div class=\"photo-editor-ui_loader noselect\"><span class=\"photo-editor-ui_loader-text\">" + text + "</span></div>");
            };
            HTMLControls.DEFAULT_DOM_ELEMENT = 'div';
            HTMLControls.CSS_PREFIX = 'photo-editor-ui_';
            return HTMLControls;
        })();
        Html.HTMLControls = HTMLControls;
    })(Html = PhotoEditor.Html || (PhotoEditor.Html = {}));
})(PhotoEditor || (PhotoEditor = {}));


var PhotoEditor;
(function (PhotoEditor) {
    var Html;
    (function (Html) {
        var EventBinder = (function () {
            function EventBinder(actions) {
                this.actions = actions;
                this.lockedRatio = true;
                this.prevResizeValues = { w: 0, h: 0 };
            }
            EventBinder.prototype.HandleRatioInputKeyUp = function ($caller, $target, dimension, e, submit, cancel) {
                var inputValue = $caller.val();
                var value = inputValue.replace(/[^0-9.]/g, '');
                var prevVal = dimension === PhotoEditor.Globals.ImageDimension.W ? this.prevResizeValues.w : this.prevResizeValues.h;
                if (inputValue != prevVal) {
                    $caller.val(value);
                    if (dimension === PhotoEditor.Globals.ImageDimension.W)
                        this.prevResizeValues.w = parseInt(value);
                    else
                        this.prevResizeValues.h = parseInt(value);
                }
                if (this.lockedRatio) {
                    $target.val(Math.round(value * this.actions.state.getImageRatio(dimension, true)));
                }
                if (e.which === 13)
                    submit();
                if (e.which === 27)
                    cancel();
            };
            EventBinder.prototype.HandleRatioInputBlur = function ($caller, $target, dimension) {
                var minRatio = PhotoEditor.Settings.MIN_RESIZE_RATE;
                var value = $caller.val();
                var initialDimensionSize = this.actions.state.getImageInitialSize(dimension);
                value = value > initialDimensionSize
                    ? initialDimensionSize
                    : value >= Math.round(initialDimensionSize / minRatio)
                        ? value
                        : Math.round(initialDimensionSize / minRatio);
                $caller.val(value);
                if (this.lockedRatio) {
                    $target.val(Math.round(value * this.actions.state.getImageRatio(dimension, true)));
                }
            };
            EventBinder.prototype.BindResizeEventHandlers = function ($w, $h, submit, cancel) {
                var _instance = this;
                this.prevResizeValues = { w: this.actions.state.imageW, h: this.actions.state.imageH };
                $w
                    .keyup(function (e) {
                    _instance.HandleRatioInputKeyUp($(this), $h, PhotoEditor.Globals.ImageDimension.W, e, submit, cancel);
                })
                    .blur(function () {
                    _instance.HandleRatioInputBlur($(this), $h, PhotoEditor.Globals.ImageDimension.W);
                });
                $h
                    .keyup(function (e) {
                    _instance.HandleRatioInputKeyUp($(this), $w, PhotoEditor.Globals.ImageDimension.H, e, submit, cancel);
                })
                    .blur(function () {
                    _instance.HandleRatioInputBlur($(this), $w, PhotoEditor.Globals.ImageDimension.H);
                });
            };
            EventBinder.prototype.BindSlider = function (type, adjustment, bindValue) {
                var instance = this;
                var $slider = $("#photo-editor-ui_slider");
                var getDisplayValue = function (value) {
                    var sliderRange = parseFloat(200);
                    var normalizeMultiplier = sliderRange / parseFloat(((adjustment.max) - (adjustment.min)));
                    var overflow = (adjustment.max + adjustment.min) * (parseFloat(normalizeMultiplier) / parseFloat((sliderRange / 100)));
                    var normalized = (value * normalizeMultiplier) * 100 - overflow;
                    return Math.round(normalized);
                };
                var $numBox = $("<span class=\"ui-slider-numbox\">" + getDisplayValue(bindValue / adjustment.multiplier) + "</span>");
                $slider.slider({
                    range: "min",
                    min: adjustment.min,
                    max: adjustment.max,
                    value: bindValue,
                    step: 0.01,
                    slide: function (event, ui) {
                        var value = parseFloat((parseFloat(ui.value) / parseFloat(adjustment.multiplier))).toPrecision(4);
                        $numBox.text(getDisplayValue(value));
                        instance.actions.Adjust(type, parseFloat(value));
                    }
                });
                $slider.find(".ui-slider-handle").append($numBox);
            };
            return EventBinder;
        })();
        Html.EventBinder = EventBinder;
    })(Html = PhotoEditor.Html || (PhotoEditor.Html = {}));
})(PhotoEditor || (PhotoEditor = {}));


var PhotoEditor;
(function (PhotoEditor) {
    var Editor;
    (function (Editor) {
        var ImageEditor = (function () {
            /**
            * Creates new BfrowPhotoEditor instance
            * @param {string} containerId
            * @param {string} imageUrl
            */
            function ImageEditor(containerId, imageUrl) {
                this.containerId = containerId;
                this.imageUrl = imageUrl;
                this.actions = null;
                this.eventBinder = null;
                //dispose previous editor if any
                if (typeof (PhotoEditor.Globals._editorDisposator) === 'function') {
                    PhotoEditor.Globals._editorDisposator();
                }
            }
            /**
            * Loads the editor into DOM.
            * Calls "PhotoEditor.Handlers.onEditorLoaded" handler on ready state
            * Calls "PhotoEditor.Handlers.onSaveHandler" handler on save
            */
            ImageEditor.prototype.LoadEditor = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    PhotoEditor.Html.HTMLControls.ShowLoader($("#" + _this.containerId), "loading...");
                    var containerparent = document.getElementById(_this.containerId);
                    var containerselector = _this.containerId + "-editor";
                    $("#" + _this.containerId).append(PhotoEditor.Html.HTMLControls.GetEditorContainer(containerselector));
                    var container = document.getElementById(containerselector);
                    var image = new Image();
                    var renderer = 'webgl'; //'webgl', 'canvas'
                    image.onload = function () { _this._imageOnLoad(container, renderer, image, resolve); };
                    image.src = _this.imageUrl;
                    //console.log(image.src);
                });
            };
            ImageEditor.prototype._imageOnLoad = function (container, renderer, image, resolve) {
                var _this = this;
                console.log("loading image: \"" + this.imageUrl + "\" into: \"#" + this.containerId + "\"");
                var editor = new PhotoEditorSDK.UI.ReactUI({
                    //pixelRatio: 1,
                    //pixelRatio: window.devicePixelRatio,
                    container: container,
                    assets: {
                        baseUrl: PhotoEditor.Settings.APP_ROOT_PATH + "js/PhotoEditorSDK/" + PhotoEditor.Globals.sdkVersionFolder + "/assets" // <-- This should be the absolute path to your `assets` directory
                    },
                    showNewButton: false,
                    showCloseButton: false,
                    preferredRenderer: renderer,
                    responsive: true,
                    enableDrag: false,
                    enableZoom: true,
                    webcam: true,
                    forcePOT: false,
                    //tools: ["crop", "rotation", "flip", "filter", "brightness", "saturation", "contrast", "exposure", "shadows", "highlights"/*, "radial-focus", "linear-focus"*/],
                    //controlsOrder: [["crop", "orientation"],["filter"],["adjustments", "focus"]],
                    tools: ["crop"],
                    controlsOrder: [["crop"]],
                    maxMegaPixels: { desktop: 10, mobile: 5 },
                    export: { type: PhotoEditorSDK.RenderType.DATAURL, download: false },
                });
                this.actions = new PhotoEditor.Actions.SDKActions(editor, editor.setImage(image) /*edited source code*/, this.containerId, image);
                this.eventBinder = new PhotoEditor.Html.EventBinder(this.actions);
                this._initializeUI($("#" + this.containerId));
                PhotoEditor.Globals._editorDisposator = function () {
                    _this.actions.DisposeEditor(true);
                };
                this._getReadyState(resolve, 1);
            };
            ImageEditor.prototype._getReadyState = function (resolve, inc) {
                var _this = this;
                try {
                    //console.log(100 * inc);
                    this.actions.sdk.getInputDimensions();
                    resolve(this.actions);
                    if (typeof (PhotoEditor.Handlers.onEditorLoaded) === 'function') {
                        PhotoEditor.Handlers.onEditorLoaded(this.actions);
                    }
                    ;
                    PhotoEditor.Html.HTMLControls.HideLoader();
                }
                catch (e) {
                    setTimeout(function () { _this._getReadyState(resolve, ++inc); }, 100 * inc);
                }
            };
            ImageEditor.prototype._initializeUI = function ($container) {
                var _this = this;
                var parentId = $container.attr('id');
                var $uiContainer = $("<div class=\"photo-editor-ui_container " + parentId + "\"></div>");
                var $tabContainer = $('<div class="photo-editor-ui_tab-container"></div>');
                var $tab1 = $('<div data-id="1" class="active"></div>');
                var $tab2 = $('<div data-id="2"></div>');
                var $tab3 = $('<div data-id="3"></div>');
                var switchTabs = function (caller) {
                    _this.actions.init();
                    var tabId = $(caller).attr('data-id');
                    $(".photo-editor-ui_container." + parentId + " .photo-editor-ui_tab-container > div").css({ opacity: "0", height: "0" }).removeClass('active');
                    $(".photo-editor-ui_container." + parentId + " .photo-editor-ui_tab-container > div[data-id=\"" + tabId + "\"]").css({ opacity: "1", height: "auto" }).addClass('active');
                    $(".photo-editor-ui_container." + parentId + " .photo-editor-ui_tab-control-container > span").removeClass('active');
                    $(caller).addClass('active');
                };
                var $tabControlContainer = $('<div class="photo-editor-ui_tab-control-container"></div>');
                var $tabControl1 = $("<span data-id=\"1\" class=\"active\"><span>" + PhotoEditor.Globals.Texts.EditorNav.PictureSettings + "</span></span>").click(function () { switchTabs(this); });
                var $tabControl2 = $("<span data-id=\"2\"><span>" + PhotoEditor.Globals.Texts.EditorNav.FilterGalery + "</span></span>").click(function () { switchTabs(this); });
                var $tabControl3 = $("<span data-id=\"3\"><span>" + PhotoEditor.Globals.Texts.EditorNav.ColorSettings + "</span></span>").click(function () { switchTabs(this); });
                var getControlsContainer = function ($content) {
                    return $('<div class="photo-editor-ui_controls-container"></div>')
                        .append($content);
                };
                $tab1.append(getControlsContainer(this._getTab1Content($tab1)));
                $tab2.append(getControlsContainer(this._getTab2Content($tab2)));
                $tab3.append(getControlsContainer(this._getTab3Content($tab3)));
                var $buttonContainer = $('<div class="photo-editor-ui_buttons"></div>');
                var $disposeEditorButton = $("<span class=\"photo-editor-ui_btn-dispose\">" + PhotoEditor.Globals.Texts.Buttons.Back + "</span>").click(function () { _this.actions.DisposeEditor(true); });
                var $saveImageButton = $("<span class=\"photo-editor-ui_btn-save\">" + PhotoEditor.Globals.Texts.Buttons.Done + "</span>").click(function () {
                    PhotoEditor.Html.HTMLControls.ShowLoader($("#" + _this.containerId), "saving...");
                    var format = _this.imageUrl.indexOf(".png") > -1
                        ? PhotoEditorSDK.ImageFormat.PNG
                        : PhotoEditorSDK.ImageFormat.JPEG;
                    _this.actions.Export(PhotoEditorSDK.ImageFormat.PNG, function (exportedImage) {
                        if (typeof (PhotoEditor.Handlers.onSaveHandler) === 'function')
                            PhotoEditor.Handlers.onSaveHandler(exportedImage);
                    }, true);
                });
                $tabContainer.append($tab1, $tab2, $tab3);
                $tabControlContainer.append($tabControl1, $tabControl2, $tabControl3);
                $buttonContainer.append($disposeEditorButton, $saveImageButton);
                $uiContainer.append($tabControlContainer, $tabContainer, $buttonContainer);
                $container.append($uiContainer);
                this._applySlickJS(1);
                this._applySlickJS(2);
                this._applySlickJS(3);
            };
            ImageEditor.prototype._getTab1Content = function ($parent) {
                var _this = this;
                var $rotateLeft = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.RotateLeft, 'rotate-left', function () { _this.actions.Rotate(PhotoEditor.Globals.RotateDirection.Left); }));
                var $rotateRight = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.RotateRight, 'rotate-right', function () { _this.actions.Rotate(PhotoEditor.Globals.RotateDirection.Right); }));
                var $flipH = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.FlipH, 'flip-h', function () { _this.actions.Flip(PhotoEditor.Globals.FlipDirection.Horizontal); }));
                var $flipV = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.FlipV, 'flip-v', function () { _this.actions.Flip(PhotoEditor.Globals.FlipDirection.Vertical); }));
                var $crop = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Crop, 'crop', function () {
                    _this.actions.StartCropping(function () {
                        var $cancelCrop = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Cancel, 'cancel', function () { _this.actions._disposeSubControls(); _this.actions.CancelCrop(); }));
                        var $submitCrop = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Submit, 'submit', function () { _this.actions._disposeSubControls(); _this.actions.SubmitCrop(); }));
                        //let $customCrop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.CropCustom, 'crop-custom',
                        //    ($caller) => { this.actions.CropCustom(); }
                        //));
                        //let $squareCrop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.CropSquare, 'crop-square',
                        //    ($caller) => { this.actions.CropSquare(); }
                        //));
                        //let $4to3Crop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Crop4to3, 'crop-4to3',
                        //    ($caller) => { this.actions.Crop4to3(); }
                        //));
                        //let $16to9Crop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Crop16to9, 'crop-16to9',
                        //    ($caller) => { this.actions.Crop16to6(); }
                        //));
                        _this.actions.init(function () { _this.actions._disposeSubControls(); _this.actions.CancelCrop(); }, function () {
                            _this.actions._createSubControls([$cancelCrop, $submitCrop], $parent);
                        });
                    });
                }));
                var $resize = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Resize, 'resize', function () {
                    var $widthInput = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(_this.actions.state.imageW, 'input-width', function () { }, 'input', PhotoEditor.Globals.Texts.Inputs.ResizeWidthPlch));
                    var $heightInput = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(_this.actions.state.imageH, 'input-height', function () { }, 'input', PhotoEditor.Globals.Texts.Inputs.ResizeHeightPlch));
                    var $lockRatioButton = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.LockRatio, "lock-ratio " + (_this.eventBinder.lockedRatio ? "active" : ""), function () {
                        _this.eventBinder.lockedRatio = !_this.eventBinder.lockedRatio;
                        if (_this.eventBinder.lockedRatio) {
                            $lockRatioButton.addClass('active');
                            $widthInput.keyup();
                        }
                        else {
                            $lockRatioButton.removeClass('active');
                        }
                    }));
                    var cancel = function () { _this.actions._disposeSubControls(); };
                    var $cancelResize = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Cancel, 'cancel', cancel));
                    var submit = function () {
                        var w = 0;
                        var h = 0;
                        if ($widthInput.val() != '' && $heightInput.val() != '') {
                            w = +$widthInput.val();
                            h = +$heightInput.val();
                            if (!isNaN(w) && !isNaN(h)) {
                                _this.actions.ResizeImage(w, h);
                                _this.actions._disposeSubControls();
                            }
                        }
                    };
                    var $submitResize = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Submit, 'submit', submit));
                    _this.eventBinder.BindResizeEventHandlers($widthInput, $heightInput, submit, cancel);
                    _this.actions.init(_this.actions._disposeSubControls, function () {
                        _this.actions._createSubControls([$cancelResize, $widthInput, $lockRatioButton, $heightInput, $submitResize], $parent);
                    });
                }));
                var $fitToScreen = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.FitToScreen, 'fitToScreen', function () { _this.actions.TriggerFitToScreen(); }));
                var $resetTab1 = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Resset, 'resetTab1', function () { _this.actions.ResetPictureSettings(); }));
                return [$crop, $rotateLeft, $rotateRight, $flipH, $flipV, $fitToScreen, $resetTab1];
            };
            ImageEditor.prototype._getTab2Content = function ($parent) {
                return this.actions.GenerateFilterIcons();
            };
            ImageEditor.prototype._getTab3Content = function ($parent) {
                var _this = this;
                var instance = this;
                var cancel = function (adjustmentType) {
                    var adjustment = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(adjustmentType);
                    _this.actions.Adjust(adjustmentType, parseFloat(adjustment.initial) / adjustment.multiplier);
                    _this.actions._disposeSubControls();
                };
                var getCancelButton = function (adjustmentType) {
                    var $cancel = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Cancel, 'cancel', function () {
                        cancel(adjustmentType);
                    }));
                    return $cancel;
                };
                var getSubmitButton = function () {
                    var $submit = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Submit, 'submit', function () {
                        _this.actions.state.adjustStateSaved = true;
                        _this.actions._disposeSubControls();
                    }));
                    return $submit;
                };
                var getSubControls = function (type, bindValue) {
                    _this.actions.init(function () {
                        if (!_this.actions.state.adjustStateSaved) {
                            cancel(type);
                        }
                        _this.actions._disposeSubControls();
                    }, function () {
                        _this.actions._createSubControls([
                            PhotoEditor.Html.HTMLControls.GetSliderStaticBox(),
                            PhotoEditor.Html.HTMLControls.GetSlider(),
                            getCancelButton(type),
                            getSubmitButton()
                        ], $parent, function () {
                            _this.actions.state.adjustStateSaved = false;
                            _this.eventBinder.BindSlider(type, PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(type), bindValue);
                        });
                    });
                };
                var $brightness = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Brightness, 'brightness', function () { getSubControls(PhotoEditor.Globals.AdjustmentTypes.Brightness, _this.actions.state.brightnessValue); }));
                var $saturation = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Saturation, 'saturation', function () { getSubControls(PhotoEditor.Globals.AdjustmentTypes.Saturation, _this.actions.state.saturationValue); }));
                var $contrast = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Contrast, 'contrast', function () { getSubControls(PhotoEditor.Globals.AdjustmentTypes.Contrast, _this.actions.state.contrastValue); }));
                var $exposure = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Exposure, 'exposure', function () { getSubControls(PhotoEditor.Globals.AdjustmentTypes.Exposure, _this.actions.state.exposureValue); }));
                var $shadows = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Shadows, 'shadows', function () { getSubControls(PhotoEditor.Globals.AdjustmentTypes.Shadows, _this.actions.state.shadowsValue); }));
                var $highlights = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Highlights, 'highlights', function () { getSubControls(PhotoEditor.Globals.AdjustmentTypes.Highlights, _this.actions.state.highlightsValue); }));
                var $resetTab = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Resset, 'resetTab1', function () { _this.actions.ResetColorSettings(); }));
                return [$contrast, $brightness, $shadows, $saturation, $exposure, $highlights, $resetTab];
            };
            ImageEditor.prototype._applySlickJS = function (tabId) {
                $("#" + this.containerId + " .photo-editor-ui_tab-container > div:nth-child(" + tabId + ") > .photo-editor-ui_controls-container").slick({
                    slidesToShow: 9,
                    slidesToScroll: 9,
                    dots: true,
                    touchMove: true,
                    infinite: false,
                    arrows: false,
                    responsive: [
                        {
                            breakpoint: 1000,
                            settings: {
                                slidesToShow: 7,
                                slidesToScroll: 7
                            }
                        },
                        {
                            breakpoint: 800,
                            settings: {
                                slidesToShow: 6,
                                slidesToScroll: 6
                            }
                        },
                        {
                            breakpoint: 700,
                            settings: {
                                slidesToShow: 5,
                                slidesToScroll: 5
                            }
                        },
                        {
                            breakpoint: 550,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 4
                            }
                        }
                    ]
                });
            };
            return ImageEditor;
        })();
        Editor.ImageEditor = ImageEditor;
        ;
    })(Editor = PhotoEditor.Editor || (PhotoEditor.Editor = {}));
})(PhotoEditor || (PhotoEditor = {}));


var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//public reference
var BfrowPhotoEditor = (function (_super) {
    __extends(BfrowPhotoEditor, _super);
    function BfrowPhotoEditor() {
        _super.apply(this, arguments);
    }
    return BfrowPhotoEditor;
})(PhotoEditor.Editor.ImageEditor);



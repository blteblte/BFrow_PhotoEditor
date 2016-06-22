var PhotoEditor;
(function (PhotoEditor) {
    var Globals;
    (function (Globals) {
        Globals.sdkVersionFolder = "3.3.0";
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
                FlipH: "Flip Horizontal",
                FlipV: "Flip Vertical",
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
                Submit: "Submit"
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
                    this.rotation = 0;
                    this.flippedH = false;
                    this.flippedV = false;
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


var PhotoEditor;
(function (PhotoEditor) {
    var Actions;
    (function (Actions) {
        var SDK;
        (function (SDK) {
            var BaseAction = (function () {
                function BaseAction(sdk, editor, containerId, image) {
                    var _this = this;
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
                                setTimeout(function () { _this.state.originalZoom = sdk.getZoom(); inresize = false; }, 800);
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
                    var ratio = 1;
                    if (_outputDimensions.y > _canvas.height) {
                        ratio = _canvas.height / _outputDimensions.y;
                    }
                    if (_outputDimensions.x > _canvas.width) {
                        ratio = _canvas.width / _outputDimensions.x;
                    }
                    var zoomRatioToSet = ratio == 1
                        ? this.state.originalZoom
                        : this.state.originalZoom * ratio;
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
                    var hasOrientationOperations = this.state.RotationOperationStack.length > 0 || this.state.FlipOperationStack.length > 0;
                    if (hasOrientationOperations) {
                        this.state.ClearRotationStack();
                        this.state.rotation = 0;
                        this.state.ClearFlipStack();
                        this.state.flippedH = false;
                        this.state.flippedV = false;
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
                        //TODO: -> buggy with combination with ReactUI - check on next release
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
                                    setTimeout(function () { _this.DisposeEditor(); }, 1000);
                                }
                            });
                        });
                    });
                };
                BaseAction.prototype.DisposeEditor = function () {
                    //do not dispose sdk -> single instance
                    //this.sdk.dispose();
                    var id = "#" + this.containerId;
                    $(id).remove();
                    console.log(id + " disposed");
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
                function BasicActions(sdk, editor, containerId, image) {
                    _super.call(this, sdk, editor, containerId, image);
                }
                BasicActions.prototype.Rotate = function (direction) {
                    var _this = this;
                    this.init(null, function () {
                        _this.state.ClearRotationStack();
                        var rotateOperation = new PhotoEditorSDK.Operations.OrientationOperation(_this.sdk, {});
                        var rotateTo = direction === PhotoEditor.Globals.RotateDirection.Left ? -90 : 90;
                        rotateOperation.setRotation(_this.state._getRotation(rotateTo));
                        _this.state.RotationOperationStack.push(rotateOperation);
                        _this.sdk.addOperation(rotateOperation);
                        _this.FitToScreen(null);
                    });
                };
                BasicActions.prototype.Flip = function (dir) {
                    this.state.ClearFlipStack();
                    var flipOperation = new PhotoEditorSDK.Operations.OrientationOperation(this.sdk, {});
                    if (dir === PhotoEditor.Globals.FlipDirection.Horizontal) {
                        this.state.flippedH = !this.state.flippedH;
                        flipOperation.setFlipHorizontally(this.state.flippedH);
                    }
                    else {
                        this.state.flippedV = !this.state.flippedV;
                        flipOperation.setFlipVertically(this.state.flippedV);
                    }
                    this.state.FlipOperationStack.push(flipOperation);
                    this.sdk.addOperation(flipOperation);
                    this.sdk.render();
                };
                //todo: scetch
                BasicActions.prototype.ResizeImage = function (w, h) {
                    var _this = this;
                    this.ResetOrientation(function () {
                        _this.init(null, function () {
                            _this.state.imageW = w;
                            _this.state.imageH = h;
                            var dimensions = new PhotoEditorSDK.Math.Vector2(w, h);
                            _this.sdk.setImage(_this.image, _this.sdk.getExif(), dimensions);
                            _this.FitToScreen(null);
                        });
                    }, false);
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
                function ReactUIBase(sdk, editor, containerId, image) {
                    _super.call(this, sdk, editor, containerId, image);
                    this._isInControl = false;
                    this._AdjustInitButtonSelector = '#' + containerId +
                        ' .pesdk-react-controls__button__icon[data-reactid=".'
                        + this.editorIndex
                        + '.1.1.2.0.0.0.0.0.0.$adjustments.0.0"]';
                    this._AdjustSubmitSelector = '#' + containerId +
                        ' .pesdk-react-controls__largeButton__icon[data-reactid=".'
                        + this.editorIndex
                        + '.1.1.2.0.0.1.0.0.0"]';
                    this._FiltersInitButtonSelector = '#' + containerId +
                        ' .pesdk-react-controls__button__icon[data-reactid=".'
                        + this.editorIndex
                        + '.1.1.2.0.0.0.0.0.0.$filter.0.0"]';
                    this._FiltersSubmitSelector = '#' + containerId +
                        ' .pesdk-react-controls__largeButton__icon[data-reactid=".'
                        + this.editorIndex
                        + '.1.1.2.0.0.1.0.0.0"]';
                    this._CropInitButtonSelector =
                        "#" + this.containerId + " .pesdk-react-controls__button__icon[data-reactid=\"." + this.editorIndex + ".1.1.2.0.0.0.0.0.0.$crop.0.0\"]";
                    this._CropCancelSelector =
                        "#" + this.containerId + " .pesdk-react-controls__largeButton__icon[data-reactid=\"." + this.editorIndex + ".1.1.2.0.0.0.0.0.0\"]";
                    this._CropSubmitSelector =
                        "#" + this.containerId + " .pesdk-react-controls__largeButton__icon[data-reactid=\"." + this.editorIndex + ".1.1.2.0.0.0.2.0.0\"]";
                }
                ReactUIBase.prototype._createSubControls = function (buttonControls, $target) {
                    var $subActionsContainer = $("<div class=\"photo-editor-ui_sub-controls-container\"></div>");
                    buttonControls.forEach(function (v, i) {
                        $subActionsContainer.append(v);
                    });
                    $target.append($subActionsContainer);
                };
                ReactUIBase.prototype._disposeSubControls = function () {
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
                //v 3.2.0
                //getFilterImageByName(filterName) {
                //    var path = 'content/js/PhotoEditorSDK/assets/ui/react/controls/filters/';
                //    //TODO: no switch needed here -> just use <filterName>.jpeg/.png for image names
                //    switch (filterName) {
                //        case 'IdentityFilter': return path + 'identity@2x.png';
                //        case 'A15Filter': return path + 'a15@2x.png';
                //        case 'BreezeFilter': return path + 'breeze@2x.png';
                //        case 'BWFilter': return path + 'bw@2x.png';
                //        case 'BWHardFilter': return path + 'bwhard@2x.png';
                //        case 'CelsiusFilter': return path + 'celsius@2x.png';
                //        case 'ChestFilter': return path + 'chest@2x.png';
                //        case 'FixieFilter': return path + 'fixie@2x.png';
                //        case 'FoodFilter': return path + 'food@2x.png';
                //        case 'FridgeFilter': return path + 'fridge@2x.png';
                //        case 'FrontFilter': return path + 'front@2x.png';
                //        case 'GlamFilter': return path + 'glam@2x.png';
                //        case 'GobblinFilter': return path + 'gobblin@2x.png';
                //        //case 'K1Filter': return path + 'k1@2x.png';
                //        //case 'K2Filter': return path + 'k2@2x.png';
                //        //case 'K6Filter': return path + 'k6@2x.png';
                //        //case 'KDynamicFilter': return path + 'kdynamic@2x.png';
                //        case 'LeninFilter': return path + 'lenin@2x.png';
                //        case 'LomoFilter': return path + 'lomo@2x.png';
                //        case 'MellowFilter': return path + 'mellow@2x.png';
                //        //case 'MorningFilter': return path + 'morning@2x.png';
                //        case 'OrchidFilter': return path + 'orchid@2x.png';
                //        case 'PolaFilter': return path + 'pola@2x.png';
                //        case 'Pola669Filter': return path + 'pola669@2x.png';
                //        case 'QuoziFilter': return path + 'quozi@2x.png';
                //        case 'SemiredFilter': return path + 'semired@2x.png';
                //        case 'SunnyFilter': return path + 'sunny@2x.png';
                //        case 'TexasFilter': return path + 'texas@2x.png';
                //        case 'X400Filter': return path + 'x400@2x.png';
                //    }
                //}
                //v 3.3.0
                /**
                * Gets filter image by filter name
                * @param {string} filterName
                * @return {string}
                */
                ReactUIBase.prototype.getFilterImageByName = function (filterName) {
                    var path = "content/js/PhotoEditorSDK/" + PhotoEditor.Globals.sdkVersionFolder + "/assets/ui/react/controls/filters/";
                    //TODO: no switch needed here -> just use <filterName>.jpeg/.png for image names
                    switch (filterName) {
                        case 'IdentityFilter': return path + 'identity@2x.png';
                        case 'A15Filter': return path + 'a15@2x.png';
                        case 'BreezeFilter': return path + 'breeze@2x.png';
                        case 'BWFilter': return path + 'bw@2x.png';
                        case 'BWHardFilter': return path + 'bwhard@2x.png';
                        case 'CelsiusFilter': return path + 'celsius@2x.png';
                        case 'ChestFilter': return path + 'chest@2x.png';
                        case 'FixieFilter': return path + 'fixie@2x.png';
                        case 'FoodFilter': return path + 'food@2x.png';
                        case 'FridgeFilter': return path + 'fridge@2x.png';
                        case 'FrontFilter': return path + 'front@2x.png';
                        case 'GlamFilter': return path + 'glam@2x.png';
                        case 'GobblinFilter': return path + 'gobblin@2x.png';
                        //case 'K1Filter': return path + 'k1@2x.png';
                        //case 'K2Filter': return path + 'k2@2x.png';
                        //case 'K6Filter': return path + 'k6@2x.png';
                        //case 'KDynamicFilter': return path + 'kdynamic@2x.png';
                        case 'LeninFilter': return path + 'lenin@2x.png';
                        case 'LomoFilter': return path + 'lomo@2x.png';
                        case 'MellowFilter': return path + 'mellow@2x.png';
                        case 'MetalFilter': return path + 'metal@2x.png';
                        //case 'MorningFilter': return path + 'morning@2x.png';
                        case 'OrchidFilter': return path + 'orchid@2x.png';
                        case 'PolaFilter': return path + 'pola@2x.png';
                        case 'Pola669Filter': return path + 'pola669@2x.png';
                        case 'QuoziFilter': return path + 'quozi@2x.png';
                        case 'SemiredFilter': return path + 'semired@2x.png';
                        case 'SunnyFilter': return path + 'sunny@2x.png';
                        case 'TexasFilter': return path + 'texas@2x.png';
                        case 'X400Filter': return path + 'x400@2x.png';
                        default: return path + 'identity@2x.png';
                    }
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
                ReactUIOverlay.prototype.GenerateFilterIcons = function () {
                    var _this = this;
                    var filters = [];
                    $.each(PhotoEditorSDK.Filters, function (i, filter) {
                        if (filter.identifier !== 'k1'
                            && filter.identifier !== 'k2'
                            && filter.identifier !== 'k6'
                            && filter.identifier !== 'kdynamic'
                            && filter.identifier !== 'morning') {
                            var $filterContainer = $('<div class="photo-editor-filter-item"></div>').click(function () {
                                _this.StartFilter(filter.identifier);
                            });
                            var $image = $("<img src=\"" + _this.getFilterImageByName(filter.name) + "\" alt=\"\" />");
                            var $nameItem = $("<div>" + filter.displayName + "</div>");
                            $filterContainer.append($image, $nameItem);
                            filters.push($filterContainer);
                        }
                    });
                    return filters;
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
                var _editor = editor;
                var _internalEditor = internalInstance !== null
                    ? internalInstance._component._reactInternalInstance._instance.refs.screen._editor
                    : null;
                var _sdk = _internalEditor !== null
                    ? _internalEditor.getSDK()
                    : null;
                //console.log(editor);
                //console.log(_internalEditor);
                //console.log(_sdk);
                _super.call(this, _sdk, _internalEditor, containerId, image);
                this.reactEditor = _editor;
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
        //TODO: make this one generic + interface
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
                    return $("<" + tag + " class=\"" + this.CSS_PREFIX + buttonControl.cssClass + "\">" + buttonControl.text + "</" + tag + ">")
                        .click(function () { buttonControl.onclick($(this)); });
                }
            };
            HTMLControls.DEFAULT_DOM_ELEMENT = 'button';
            HTMLControls.CSS_PREFIX = 'photo-editor-ui_';
            return HTMLControls;
        })();
        Html.HTMLControls = HTMLControls;
    })(Html = PhotoEditor.Html || (PhotoEditor.Html = {}));
})(PhotoEditor || (PhotoEditor = {}));


var PhotoEditor;
(function (PhotoEditor) {
    var Editor;
    (function (Editor) {
        var ImageEditor = (function () {
            /**
            * Creates new editor instance
            * @param {string} containerId
            * @param {number} dataId
            * @param {string} imageUrl
            */
            function ImageEditor(containerId, dataId, imageUrl) {
                this.containerId = containerId;
                this.dataId = dataId;
                this.imageUrl = imageUrl;
                this.lockedRatio = true;
                //TODO: this doesnt belong here
                //TODO: obj
                this.prevResizeValues = { w: 0, h: 0 };
                this.actions = null;
            }
            ImageEditor.prototype.LoadEditor = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var containerparent = document.getElementById(_this.containerId);
                    var containerselector = _this.containerId + "-editor";
                    $("#" + _this.containerId).append("<div id=\"" + containerselector + "\" style=\"width: 100%; height: 90%;\"></div>");
                    var container = document.getElementById(containerselector);
                    var image = new Image();
                    var renderer = 'webgl'; //'webgl', 'canvas'
                    //test ONLY -> remove this later
                    renderer = $('#renderer-select').val();
                    //
                    image.onload = function () {
                        console.log("loading image: \"" + _this.imageUrl + "\" into: \"#" + _this.containerId + "\"");
                        //TODO: TYPE + extend this
                        var editor = new PhotoEditorSDK.UI.ReactUI({
                            pixelRatio: 1,
                            container: container,
                            assets: {
                                baseUrl: "content/js/PhotoEditorSDK/" + PhotoEditor.Globals.sdkVersionFolder + "/assets" // <-- This should be the absolute path to your `assets` directory
                            },
                            showNewButton: false,
                            showCloseButton: false,
                            preferredRenderer: renderer,
                            responsive: true,
                            enableDrag: false,
                            enableZoom: true,
                            webcam: true,
                            forcePOT: false,
                            tools: ["crop", "rotation", "flip", "filter", "brightness", "saturation", "contrast", "exposure", "shadows", "highlights" /*, "radial-focus", "linear-focus"*/],
                            controlsOrder: [
                                ["crop", "orientation"],
                                ["filter"],
                                ["adjustments", "focus"]
                            ],
                            maxMegaPixels: { desktop: 10, mobile: 5 },
                            export: { type: PhotoEditorSDK.RenderType.DATAURL, download: false },
                        });
                        _this.actions = new PhotoEditor.Actions.SDKActions(editor, editor.setImage(image) /*edited source code*/, _this.containerId, image);
                        _this._initializeUI($("#" + _this.containerId));
                        resolve(_this.actions);
                    };
                    image.src = _this.imageUrl;
                });
            };
            ImageEditor.prototype.HandleRatioInputKeyUp = function ($caller, $target, dimension, e, submit, cancel) {
                var inputValue = $caller.val();
                var value = inputValue.replace(/[^0-9.]/g, '');
                var prevVal = dimension === "w" ? this.prevResizeValues.w : this.prevResizeValues.h;
                if (inputValue != prevVal) {
                    $caller.val(value);
                    if (dimension === "w")
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
            //TODO: this doesnt belong here
            ImageEditor.prototype.HandleRatioInputBlur = function ($caller, $target, dimension) {
                //todo: -> settings/options
                var minRatio = 5;
                var value = $caller.val();
                var initialDimensionSize = this.actions.state.getImageInitialSize(dimension);
                value = value > initialDimensionSize
                    ? initialDimensionSize
                    : value >= initialDimensionSize / minRatio
                        ? value
                        : initialDimensionSize / minRatio;
                $caller.val(value);
                if (this.lockedRatio) {
                    $target.val(Math.round(value * this.actions.state.getImageRatio(dimension, true)));
                }
            };
            //TODO: this doesnt belong here
            ImageEditor.prototype.BindResizeEventHandlers = function ($w, $h, submit, cancel) {
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
                    $(".photo-editor-ui_container." + parentId + " .photo-editor-ui_tab-container > div").hide().removeClass('active');
                    $(".photo-editor-ui_container." + parentId + " .photo-editor-ui_tab-container > div[data-id=\"" + tabId + "\"]").show().addClass('active');
                    $(".photo-editor-ui_container." + parentId + " .photo-editor-ui_tab-control-container > span").removeClass('active');
                    $(caller).addClass('active');
                };
                var $tabControlContainer = $('<div class="photo-editor-ui_tab-control-container"></div>');
                var $tabControl1 = $("<span data-id=\"1\" class=\"active\">" + PhotoEditor.Globals.Texts.EditorNav.PictureSettings + "</span>").click(function () { switchTabs(this); });
                var $tabControl2 = $("<span data-id=\"2\">" + PhotoEditor.Globals.Texts.EditorNav.FilterGalery + "</span>").click(function () { switchTabs(this); });
                var $tabControl3 = $("<span data-id=\"3\">" + PhotoEditor.Globals.Texts.EditorNav.ColorSettings + "</span>").click(function () { switchTabs(this); });
                $tab1.append(this._getTab1Content($tab1));
                $tab2.append(this._getTab2Content($tab2));
                $tab3.append(this._getTab3Content($tab3));
                $tabContainer.append($tab1, $tab2, $tab3);
                $tabControlContainer.append($tabControl1, $tabControl2, $tabControl3);
                $uiContainer.append($tabControlContainer, $tabContainer);
                $container.append($uiContainer);
            };
            ImageEditor.prototype._getTab1Content = function ($parent) {
                var _this = this;
                var $rotateLeft = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.RotateLeft, 'rotate-left', function () { _this.actions.Rotate(PhotoEditor.Globals.RotateDirection.Left); }));
                var $rotateRight = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.RotateRight, 'rotate-right', function () { _this.actions.Rotate(PhotoEditor.Globals.RotateDirection.Right); }));
                var $flipH = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.FlipH, 'flip-h', function () { _this.actions.Flip(PhotoEditor.Globals.FlipDirection.Horizontal); }));
                var $flipV = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.FlipV, 'flip-v', function () { _this.actions.Flip(PhotoEditor.Globals.FlipDirection.Vertical); }));
                var $crop = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Crop, 'crop', function () {
                    _this.actions.StartCropping(function () {
                        var $cancelCrop = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Cancel, 'crop-cancel', function () { _this.actions._disposeSubControls(); _this.actions.CancelCrop(); }));
                        var $submitCrop = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Submit, 'crop-submit', function () { _this.actions._disposeSubControls(); _this.actions.SubmitCrop(); }));
                        var $customCrop = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.CropCustom, 'crop-custom', function ($caller) { _this.actions.CropCustom(); }));
                        var $squareCrop = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.CropSquare, 'crop-square', function ($caller) { _this.actions.CropSquare(); }));
                        var $4to3Crop = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Crop4to3, 'crop-4to3', function ($caller) { _this.actions.Crop4to3(); }));
                        var $16to9Crop = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Crop16to9, 'crop-16to9', function ($caller) { _this.actions.Crop16to6(); }));
                        _this.actions.init(function () { _this.actions._disposeSubControls(); _this.actions.CancelCrop(); }, function () {
                            _this.actions._createSubControls([$cancelCrop, $customCrop, $squareCrop, $4to3Crop, $16to9Crop, $submitCrop], $parent);
                        });
                    });
                }));
                var $resize = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Resize, 'resize', function () {
                    var $widthInput = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(_this.actions.state.imageW, 'input-width', function () { }, 'input', PhotoEditor.Globals.Texts.Inputs.ResizeWidthPlch));
                    var $heightInput = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(_this.actions.state.imageH, 'input-height', function () { }, 'input', PhotoEditor.Globals.Texts.Inputs.ResizeHeightPlch));
                    var $lockRatioButton = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.LockRatio, "lock-ratio " + (_this.lockedRatio ? "active" : ""), function () {
                        _this.lockedRatio = !_this.lockedRatio;
                        if (_this.lockedRatio) {
                            $lockRatioButton.addClass('active');
                            $widthInput.keyup();
                        }
                        else {
                            $lockRatioButton.removeClass('active');
                        }
                    }));
                    var cancel = function () { _this.actions._disposeSubControls(); };
                    var $cancelResize = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Cancel, 'resize-cancel', cancel));
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
                    var $submitResize = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Submit, 'resize-submit', submit));
                    _this.BindResizeEventHandlers($widthInput, $heightInput, submit, cancel);
                    _this.actions.init(_this.actions._disposeSubControls, function () {
                        _this.actions._createSubControls([$cancelResize, $widthInput, $lockRatioButton, $heightInput, $submitResize], $parent);
                    });
                }));
                var $fitToScreen = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.FitToScreen, 'fitToScreen', function () { _this.actions.TriggerFitToScreen(); }));
                var $resetAll = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Resset, 'resetAll', function () { _this.actions.Reset(); }));
                return [$crop, $rotateLeft, $rotateRight, $flipH, $flipV, $resize, $fitToScreen, $resetAll];
            };
            ImageEditor.prototype._getTab2Content = function ($parent) {
                return this.actions.GenerateFilterIcons();
            };
            ImageEditor.prototype._getTab3Content = function ($parent) {
                var _this = this;
                var $brightness = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Brightness, 'brightness', function () { _this.actions.StartBrightness(); }));
                var $saturation = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Saturation, 'saturation', function () { _this.actions.StartSaturation(); }));
                var $contrast = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Contrast, 'contrast', function () { _this.actions.StartContrast(); }));
                var $exposure = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Exposure, 'exposure', function () { _this.actions.StartExposure(); }));
                var $shadows = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Shadows, 'shadows', function () { _this.actions.StartShadows(); }));
                var $highlights = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Highlights, 'highlights', function () { _this.actions.StartHighlights(); }));
                return [$brightness, $saturation, $contrast, $exposure, $shadows, $highlights];
            };
            return ImageEditor;
        })();
        Editor.ImageEditor = ImageEditor;
        ;
    })(Editor = PhotoEditor.Editor || (PhotoEditor.Editor = {}));
})(PhotoEditor || (PhotoEditor = {}));


var PhotoEditor;
(function (PhotoEditor) {
    var imageEditorContainerCssClass = "image-editor";
    //just a test use-case scenario for multiple editors
    //
    var ImageContainer = (function () {
        function ImageContainer(caller, options) {
            this.editors = [];
            this.imageSources = [];
            this.intEditors = 0;
            this.$container = $(caller);
            this.appendEditorsToId = options.appendTo;
            this.disposeOnSave = options.disposeOnSave || false;
            this.$appendTo = $('#' + this.appendEditorsToId);
            this.currentEditor = 0;
        }
        ImageContainer.prototype.GetImages = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var $images = _this.$container.find('img');
                $.each($images, function (i, v) {
                    _this.imageSources.push($(v).attr('src'));
                });
                if (_this.imageSources.length > 0) {
                    resolve();
                }
                else {
                    reject();
                }
            });
        };
        ImageContainer.prototype.LoadEditors = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.imageSources.forEach(function (v, i, o) {
                    var newId = "editor-" + _this.$container.attr('id') + "-" + i;
                    var activeClass = "";
                    if (i == 0)
                        activeClass = "active";
                    var $editorContainer = $("<div class=\"" + imageEditorContainerCssClass + " " + activeClass + "\" id=\"" + newId + "\" data-id=\"" + i + "\"></div>");
                    _this.$appendTo.append($editorContainer);
                    var editor = new PhotoEditor.Editor.ImageEditor(newId, i, _this.imageSources[i]);
                    editor.LoadEditor().then(function (actions) {
                        _this.editors.push(editor);
                        _this.intEditors++;
                        if (_this.intEditors == _this.imageSources.length) {
                            resolve();
                        }
                    });
                });
            });
        };
        ImageContainer.prototype.InitNavigationUI = function () {
            var _this = this;
            if (this.imageSources.length > 0) {
                this.$navButtonContainer = $('<div class="photo-editor-ui_nav"></div>');
                this.$navPagingContainer = $('<div class="photo-editor-ui_nav-paging"></div>');
                var $backButton = $("<button>" + PhotoEditor.Globals.Texts.Nav.Back + "</button>").click(function () { _this.SwitchEditors(--_this.currentEditor); });
                var $forwardButton = $("<button>" + PhotoEditor.Globals.Texts.Nav.EditNextPicture + "</button>").click(function () { _this.SwitchEditors(++_this.currentEditor); });
                var $uploadAllButton = $("<button>" + PhotoEditor.Globals.Texts.Nav.UploadAll + "</button>").click(function () { _this.UploadAll(); });
                //var pagingButtons = [];
                //for (var i = 0; i < this.intEditors; i++) {
                //    var $pg = $('<span class="photo-editor-ui_pg-item" data-id="' + i + '"></span>').click(() => {
                //        this.SwitchEditors(currentEditor = i);
                //    });
                //    alert(i, this.intEditors);
                //    if (i === this.intEditors - 1) {
                //        $navPagingContainer.append(pagingButtons);
                //        this.$appendTo.prepend($navPagingContainer);
                //    }
                //}
                this.$navButtonContainer.append(/*$backButton, $forwardButton,*/ $uploadAllButton);
                this.$appendTo.append(this.$navButtonContainer);
            }
        };
        ImageContainer.prototype.SwitchEditors = function (index) {
            if (index >= 0 && index < this.intEditors) {
                $.each(this.editors, function (i, editor) {
                    if (editor.dataId === index) {
                        $("#" + editor.containerId).addClass('active');
                    }
                    else {
                        $("#" + editor.containerId).removeClass('active');
                        editor.actions.init(null, null);
                    }
                    if (index <= i) {
                        $(".photo-editor-ui_pg-item[data-id=\"" + i + "\"]").addClass('done');
                    }
                    else {
                        $(".photo-editor-ui_pg-item[data-id=\"" + i + "\"]").removeClass('done');
                    }
                });
            }
            else {
                this.currentEditor = this.currentEditor < 0 ? 0 : this.intEditors - 1;
            }
        };
        ImageContainer.prototype.UploadAll = function () {
            var _this = this;
            var items = [];
            $.each(this.editors, function (i, editor) {
                editor.actions.Export(PhotoEditorSDK.ImageFormat.JPEG, function (obj) {
                    items.push(obj);
                    if (i === _this.intEditors - 1)
                        finalize(items);
                }, _this.disposeOnSave //dispose
                );
            });
            var finalize = function (items) {
                $('#temp-preview').fadeIn(200);
                setTimeout(function () {
                    console.log(items);
                    //TODO: upload `items` to server as JSON
                    //TEST: temp display items
                    $('#temp-preview > div').html('');
                    $.each(items, function (i, v) {
                        $('#temp-preview > div').append('<img src="' + v.image + '" alt="" />');
                    });
                    //
                }, 1000);
                if (_this.disposeOnSave) {
                    _this.$navButtonContainer.remove();
                    _this.$navButtonContainer.remove();
                }
            };
        };
        ImageContainer.prototype.CloseWithoutSave = function () {
            $.each(this.editors, function (i, editor) {
                editor.actions.DisposeEditor();
            });
            this.$navButtonContainer.remove();
            this.$navButtonContainer.remove();
        };
        return ImageContainer;
    })();
    PhotoEditor.ImageContainer = ImageContainer;
})(PhotoEditor || (PhotoEditor = {}));


/* jQuery */
(function ($) {
    $.fn.ImageContainer = function (options) {
        var imageContainer = new PhotoEditor.ImageContainer(this, options);
        imageContainer.GetImages().then(function () {
            imageContainer.LoadEditors().then(function () {
                imageContainer.InitNavigationUI();
            });
        });
    };
})(jQuery);



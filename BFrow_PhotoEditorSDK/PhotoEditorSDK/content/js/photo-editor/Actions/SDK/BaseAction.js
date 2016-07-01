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

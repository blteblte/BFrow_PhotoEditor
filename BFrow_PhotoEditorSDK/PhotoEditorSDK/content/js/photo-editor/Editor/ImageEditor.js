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

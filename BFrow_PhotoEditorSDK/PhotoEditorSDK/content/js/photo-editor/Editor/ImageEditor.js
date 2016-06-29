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
                this.actions = null;
                this.eventBinder = null;
                if (typeof (PhotoEditor.Globals._editorDisposator) === 'function') {
                    PhotoEditor.Globals._editorDisposator();
                }
            }
            ImageEditor.prototype.LoadEditor = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var containerparent = document.getElementById(_this.containerId);
                    var containerselector = _this.containerId + "-editor";
                    $("#" + _this.containerId).append("<div id=\"" + containerselector + "\" class=\"photo-editor-instance-container\" style=\"width: 100%;\"></div>");
                    var container = document.getElementById(containerselector);
                    var image = new Image();
                    var renderer = 'webgl'; //'webgl', 'canvas'
                    //test ONLY -> remove this later
                    renderer = $('#renderer-select').val();
                    //
                    image.onload = function () {
                        console.log("loading image: \"" + _this.imageUrl + "\" into: \"#" + _this.containerId + "\"");
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
                        _this.eventBinder = new PhotoEditor.Html.EventBinder(_this.actions);
                        _this._initializeUI($("#" + _this.containerId));
                        PhotoEditor.Globals._editorDisposator = function () {
                            _this.actions.DisposeEditor(true);
                        };
                        resolve(_this.actions);
                    };
                    image.src = _this.imageUrl;
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
                var $buttonContainer = $('<div class="photo-editor-ui_buttons"></div>');
                var $disposeEditorButton = $("<span>" + PhotoEditor.Globals.Texts.Buttons.Back + "</span>").click(function () { _this.actions.DisposeEditor(true); });
                var $saveImageButton = $("<span>" + PhotoEditor.Globals.Texts.Buttons.Done + "</span>").click(function () {
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
                return [$crop, $rotateLeft, $rotateRight, $flipH, $flipV, $resize, $fitToScreen, $resetTab1];
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
                var getSlider = function () {
                    return $("<div id=\"photo-editor-ui_slider\"></div>");
                };
                var bindSlider = function (type, adjustment, bindValue) {
                    $("#photo-editor-ui_slider").slider({
                        range: "min",
                        min: adjustment.min,
                        max: adjustment.max,
                        value: bindValue,
                        slide: function (event, ui) {
                            instance.actions.Adjust(type, parseFloat(ui.value) / adjustment.multiplier);
                        }
                    });
                };
                var getSubControls = function (type, bindValue) {
                    _this.actions.init(function () {
                        if (!_this.actions.state.adjustStateSaved) {
                            cancel(type);
                        }
                        _this.actions._disposeSubControls();
                    }, function () {
                        _this.actions._createSubControls([
                            getCancelButton(type),
                            getSlider(),
                            getSubmitButton()
                        ], $parent, function () {
                            _this.actions.state.adjustStateSaved = false;
                            bindSlider(type, PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(type), bindValue);
                        });
                    });
                };
                var $brightness = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Brightness, 'brightness', function () { getSubControls(PhotoEditor.Globals.AdjustmentTypes.Brightness, _this.actions.state.brightnessValue); }));
                var $saturation = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Saturation, 'saturation', function () { getSubControls(PhotoEditor.Globals.AdjustmentTypes.Saturation, _this.actions.state.saturationValue); }));
                var $contrast = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Contrast, 'contrast', function () { getSubControls(PhotoEditor.Globals.AdjustmentTypes.Contrast, _this.actions.state.contrastValue); }));
                var $exposure = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Exposure, 'exposure', function () { getSubControls(PhotoEditor.Globals.AdjustmentTypes.Exposure, _this.actions.state.exposureValue); }));
                var $shadows = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Shadows, 'shadows', function () { getSubControls(PhotoEditor.Globals.AdjustmentTypes.Shadows, _this.actions.state.shadowsValue); }));
                var $highlights = PhotoEditor.Html.HTMLControls.GetButtonContol(new PhotoEditor.Html.HTMLButtonControl(PhotoEditor.Globals.Texts.Buttons.Highlights, 'highlights', function () { getSubControls(PhotoEditor.Globals.AdjustmentTypes.Highlights, _this.actions.state.highlightsValue); }));
                return [$contrast, $brightness, $shadows, $saturation, $exposure, $highlights];
            };
            ImageEditor.prototype._applySlickJS = function (tabId) {
                $("#" + this.containerId + " .photo-editor-ui_tab-container > div:nth-child(" + tabId + ")").slick({
                    slidesToShow: 9,
                    slidesToScroll: 1,
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
                            breakpoint: 700,
                            settings: {
                                slidesToShow: 5,
                                slidesToScroll: 5
                            }
                        },
                        {
                            breakpoint: 450,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 4
                            }
                        },
                        {
                            breakpoint: 400,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3
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

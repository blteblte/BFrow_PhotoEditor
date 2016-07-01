
namespace PhotoEditor.Editor {

    export class ImageEditor {
        actions: Actions.SDKActions;
        eventBinder: PhotoEditor.Html.EventBinder;
        /**
        * Creates new BfrowPhotoEditor instance
        * @param {string} containerId
        * @param {string} imageUrl
        */
        constructor(
            public containerId: string,
            public imageUrl: string
        ) {
            this.actions = null;
            this.eventBinder = null;

            //dispose previous editor if any
            if (typeof(Globals._editorDisposator) === 'function') {
                Globals._editorDisposator();
            }
        }

        /**
        * Loads the editor into DOM.
        * Calls "PhotoEditor.Handlers.onEditorLoaded" handler on ready state
        * Calls "PhotoEditor.Handlers.onSaveHandler" handler on save
        */
        LoadEditor() {
            return new Promise((resolve, reject) => {

                Html.HTMLControls.ShowLoader($(`#${this.containerId}`), "loading...");

                let containerparent = document.getElementById(this.containerId);
                let containerselector = `${this.containerId}-editor`;
                $(`#${this.containerId}`).append(Html.HTMLControls.GetEditorContainer(containerselector));
                let container = document.getElementById(containerselector);
                let image = new Image();
                let renderer = 'webgl'; //'webgl', 'canvas'

                image.onload = () => { this._imageOnLoad(container, renderer, image, resolve); };

                image.src = this.imageUrl;
                console.log(image.src);
            });
        }

        private _imageOnLoad(container: HTMLElement, renderer: string, image: HTMLImageElement, resolve) {
            console.log(`loading image: "${this.imageUrl}" into: "#${this.containerId}"`);

            const editor = new PhotoEditorSDK.UI.ReactUI({
                //pixelRatio: 1,
                container: container,
                assets: {
                    baseUrl: `${Settings.APP_ROOT_PATH}js/PhotoEditorSDK/${Globals.sdkVersionFolder}/assets` // <-- This should be the absolute path to your `assets` directory
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
                //logLevel: 'info',
            });

            this.actions = new Actions.SDKActions(editor, editor.setImage(image)/*edited source code*/, this.containerId, image);
            this.eventBinder = new PhotoEditor.Html.EventBinder(this.actions);
            this._initializeUI($(`#${this.containerId}`));

            Globals._editorDisposator = () => {
                this.actions.DisposeEditor(true);
            };

            this._getReadyState(resolve, 1);
        }

        private _getReadyState(resolve, inc: number) {
            try {
                console.log(100 * inc);
                this.actions.sdk.getInputDimensions();

                resolve(this.actions);
                if (typeof (Handlers.onEditorLoaded) === 'function') { Handlers.onEditorLoaded(this.actions) };
                Html.HTMLControls.HideLoader();
            }
            catch (e) {
                setTimeout(() => { this._getReadyState(resolve, ++inc); }, 100 * inc);
            }
        }

        private _initializeUI($container: JQuery) {
            let parentId = $container.attr('id');
            let $uiContainer = $(`<div class="photo-editor-ui_container ${parentId}"></div>`);

            let $tabContainer = $('<div class="photo-editor-ui_tab-container"></div>');
            let $tab1 = $('<div data-id="1" class="active"></div>');
            let $tab2 = $('<div data-id="2"></div>');
            let $tab3 = $('<div data-id="3"></div>');

            let switchTabs = (caller) => {
                this.actions.init();
                let tabId = $(caller).attr('data-id');
                $(`.photo-editor-ui_container.${parentId} .photo-editor-ui_tab-container > div`).css({ opacity: "0", height: "0" }).removeClass('active');
                $(`.photo-editor-ui_container.${parentId} .photo-editor-ui_tab-container > div[data-id="${tabId}"]`).css({ opacity: "1", height: "auto" }).addClass('active');
                $(`.photo-editor-ui_container.${parentId} .photo-editor-ui_tab-control-container > span`).removeClass('active');
                $(caller).addClass('active');
            };

            let $tabControlContainer = $('<div class="photo-editor-ui_tab-control-container"></div>');
            let $tabControl1 = $(`<span data-id="1" class="active"><span>${Globals.Texts.EditorNav.PictureSettings}</span></span>`).click(function () { switchTabs(this) });
            let $tabControl2 = $(`<span data-id="2"><span>${Globals.Texts.EditorNav.FilterGalery}</span></span>`).click(function () { switchTabs(this) });
            let $tabControl3 = $(`<span data-id="3"><span>${Globals.Texts.EditorNav.ColorSettings}</span></span>`).click(function () { switchTabs(this) });

            let getControlsContainer = ($content: JQuery[]) => {
                return $('<div class="photo-editor-ui_controls-container"></div>')
                    .append($content);
            }

            $tab1.append(getControlsContainer(this._getTab1Content($tab1)));
            $tab2.append(getControlsContainer(this._getTab2Content($tab2)));
            $tab3.append(getControlsContainer(this._getTab3Content($tab3)));

            let $buttonContainer = $('<div class="photo-editor-ui_buttons"></div>');
            let $disposeEditorButton = $(`<span class="photo-editor-ui_btn-dispose">${Globals.Texts.Buttons.Back}</span>`).click(() => { this.actions.DisposeEditor(true); });
            let $saveImageButton = $(`<span class="photo-editor-ui_btn-save">${Globals.Texts.Buttons.Done}</span>`).click(() => {
                let format = this.imageUrl.indexOf(".png") > -1
                    ? PhotoEditorSDK.ImageFormat.PNG
                    : PhotoEditorSDK.ImageFormat.JPEG;
                this.actions.Export(PhotoEditorSDK.ImageFormat.PNG, (exportedImage) => {
                    if (typeof (Handlers.onSaveHandler) === 'function') Handlers.onSaveHandler(exportedImage);
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
        }

        private _getTab1Content($parent: JQuery) {
            let $rotateLeft = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.RotateLeft, 'rotate-left',
                () => { this.actions.Rotate(Globals.RotateDirection.Left) }
            ));

            let $rotateRight = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.RotateRight, 'rotate-right',
                () => { this.actions.Rotate(Globals.RotateDirection.Right) }
            ));

            let $flipH = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.FlipH, 'flip-h',
                () => { this.actions.Flip(Globals.FlipDirection.Horizontal) }
            ));

            let $flipV = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.FlipV, 'flip-v',
                () => { this.actions.Flip(Globals.FlipDirection.Vertical) }
            ));

            let $crop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Crop, 'crop',
                () => {
                    this.actions.StartCropping(() => {
                        let $cancelCrop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Cancel, 'cancel',
                            () => { this.actions._disposeSubControls(); this.actions.CancelCrop(); }
                        ));
                        let $submitCrop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Submit, 'submit',
                            () => { this.actions._disposeSubControls(); this.actions.SubmitCrop(); }
                        ));
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

                        this.actions.init(() => { this.actions._disposeSubControls(); this.actions.CancelCrop(); }, () => {
                            this.actions._createSubControls([$cancelCrop, /*$customCrop, $squareCrop, $4to3Crop, $16to9Crop,*/ $submitCrop], $parent);
                        });
                    })
                }
            ));

            let $resize = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Resize, 'resize',
                () => {
                    let $widthInput = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(<string>(<any>this.actions.state.imageW), 'input-width', () => { }, 'input', Globals.Texts.Inputs.ResizeWidthPlch));
                    let $heightInput = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(<string>(<any>this.actions.state.imageH), 'input-height', () => { }, 'input', Globals.Texts.Inputs.ResizeHeightPlch));

                    var $lockRatioButton = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.LockRatio, `lock-ratio ${this.eventBinder.lockedRatio ? "active" : ""}`,
                        () => {
                            this.eventBinder.lockedRatio = !this.eventBinder.lockedRatio;
                            if (this.eventBinder.lockedRatio) {
                                $lockRatioButton.addClass('active');
                                $widthInput.keyup();
                            }
                            else {
                                $lockRatioButton.removeClass('active');
                            }
                        }
                    ));

                    let cancel = () => { this.actions._disposeSubControls(); }
                    let $cancelResize = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Cancel, 'cancel',
                        cancel
                    ));

                    let submit = () => {
                        var w: number = 0;
                        var h: number = 0;

                        if ($widthInput.val() != '' && $heightInput.val() != '') {
                            w = <number>+$widthInput.val();
                            h = <number>+$heightInput.val();

                            if (!isNaN(w) && !isNaN(h)) {
                                this.actions.ResizeImage(w, h);
                                this.actions._disposeSubControls();
                            }
                        }
                    };
                    let $submitResize = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Submit, 'submit',
                        submit
                    ));


                    this.eventBinder.BindResizeEventHandlers($widthInput, $heightInput, submit, cancel);

                    this.actions.init(this.actions._disposeSubControls, () => {
                        this.actions._createSubControls([$cancelResize, $widthInput, $lockRatioButton, $heightInput, $submitResize], $parent);
                    });
                }
            ));

            let $fitToScreen = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.FitToScreen, 'fitToScreen',
                () => { this.actions.TriggerFitToScreen() }
            ));

            let $resetTab1 = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Resset, 'resetTab1',
                () => { this.actions.ResetPictureSettings() }
            ));

            return [$crop, $rotateLeft, $rotateRight, $flipH, $flipV, /*$resize,*/ $fitToScreen, $resetTab1];
        }

        private _getTab2Content($parent: JQuery) {
            return this.actions.GenerateFilterIcons();
        }

        private _getTab3Content($parent: JQuery) {

            let instance = this;

            let cancel = (adjustmentType: Globals.AdjustmentTypes) => {
                let adjustment = Globals.AdjustmentSettings.GetAdjustmentSettings(adjustmentType);
                this.actions.Adjust(adjustmentType, parseFloat(<string><any>adjustment.initial) / adjustment.multiplier);
                this.actions._disposeSubControls();
            };

            let getCancelButton = (adjustmentType: Globals.AdjustmentTypes): JQuery => {
                var $cancel = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Cancel, 'cancel', () => {
                    cancel(adjustmentType);
                }));
                return $cancel;
            };

            let getSubmitButton = (): JQuery => {
                var $submit = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Submit, 'submit', () => {
                    this.actions.state.adjustStateSaved = true;
                    this.actions._disposeSubControls();
                }));
                return $submit;
            };

            let getSubControls = (type: Globals.AdjustmentTypes, bindValue: number) => {
                this.actions.init(() => {
                    if (!this.actions.state.adjustStateSaved){
                        cancel(type);
                    }
                    this.actions._disposeSubControls();
                }
                    , () => {
                    this.actions._createSubControls(
                        [
                            Html.HTMLControls.GetSliderStaticBox(),
                            Html.HTMLControls.GetSlider(),
                            getCancelButton(type),
                            getSubmitButton()
                        ]
                        , $parent, () => {
                            this.actions.state.adjustStateSaved = false;
                            this.eventBinder.BindSlider(type, Globals.AdjustmentSettings.GetAdjustmentSettings(type), bindValue);
                    });
                });
            };

            let $brightness = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Brightness, 'brightness',
                () => { getSubControls(Globals.AdjustmentTypes.Brightness, this.actions.state.brightnessValue); }
            ));

            let $saturation = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Saturation, 'saturation',
                () => { getSubControls(Globals.AdjustmentTypes.Saturation, this.actions.state.saturationValue); }
            ));

            let $contrast = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Contrast, 'contrast',
                () => { getSubControls(Globals.AdjustmentTypes.Contrast, this.actions.state.contrastValue); }
            ));

            let $exposure = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Exposure, 'exposure',
                () => { getSubControls(Globals.AdjustmentTypes.Exposure, this.actions.state.exposureValue); }
            ));

            let $shadows = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Shadows, 'shadows',
                () => { getSubControls(Globals.AdjustmentTypes.Shadows, this.actions.state.shadowsValue); }
            ));

            let $highlights = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Highlights, 'highlights',
                () => { getSubControls(Globals.AdjustmentTypes.Highlights, this.actions.state.highlightsValue); }
            ));

            return [$contrast, $brightness, $shadows, $saturation, $exposure, $highlights];
        }

        private _applySlickJS(tabId: number) {

            $(`#${this.containerId} .photo-editor-ui_tab-container > div:nth-child(${tabId}) > .photo-editor-ui_controls-container`).slick({
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

        }
    };
}

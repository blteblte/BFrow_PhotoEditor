
namespace PhotoEditor.Editor {

    export class ImageEditor {
        actions: Actions.SDKActions;
        lockedRatio: boolean = true;

        /**
        * Creates new editor instance
        * @param {string} containerId
        * @param {number} dataId
        * @param {string} imageUrl
        */
        constructor(
            public containerId: string,
            public dataId: number,
            public imageUrl: string
        ) {
            this.actions = null;
        }

        LoadEditor() {
            return new Promise((resolve, reject) => {

                let containerparent = document.getElementById(this.containerId);
                let containerselector = `${this.containerId}-editor`;
                $(`#${this.containerId}`).append(`<div id="${containerselector}" style="width: 100%; height: 90%;"></div>`);
                let container = document.getElementById(containerselector);
                let image = new Image();
                let renderer = 'webgl'; //'webgl', 'canvas'

                //test ONLY -> remove this later
                renderer = $('#renderer-select').val();
                //

                image.onload = () => {
                    console.log(`loading image: "${this.imageUrl}" into: "#${this.containerId}"`);

                    //TODO: TYPE + extend this
                    const editor = new PhotoEditorSDK.UI.ReactUI({
                        pixelRatio: 1,
                        container: container,
                        assets: {
                            baseUrl: `content/js/PhotoEditorSDK/${Globals.sdkVersionFolder}/assets` // <-- This should be the absolute path to your `assets` directory
                        },
                        showNewButton: false,
                        showCloseButton: false,
                        preferredRenderer: renderer,
                        responsive: true,
                        enableDrag: false,
                        enableZoom: true,
                        webcam: true,
                        forcePOT: false,
                        tools: ["crop", "rotation", "flip", "filter", "brightness", "saturation", "contrast", "exposure", "shadows", "highlights"/*, "radial-focus", "linear-focus"*/],
                        controlsOrder: [
                            ["crop", "orientation"],
                            ["filter"],
                            ["adjustments", "focus"]
                        ],
                        maxMegaPixels: { desktop: 10, mobile: 5 },
                        export: { type: PhotoEditorSDK.RenderType.DATAURL, download: false },
                        //logLevel: 'info',
                    });

                    this.actions = new Actions.SDKActions(editor, editor.setImage(image)/*edited source code*/, this.containerId, image);
                    this._initializeUI($(`#${this.containerId}`));

                    resolve(this.actions);
                };
                image.src = this.imageUrl;
            });
        }

        //TODO: this doesnt belong here
        //TODO: obj
        private prevResizeValues = { w: 0, h: 0 };
        private HandleRatioInputKeyUp($caller: JQuery, $target: JQuery, dimension: string, e: JQueryKeyEventObject
            , submit: () => void
            , cancel: () => void
        ) {
            let inputValue = $caller.val()
            let value: number = inputValue.replace(/[^0-9.]/g, '');
            let prevVal = dimension === "w" ? this.prevResizeValues.w : this.prevResizeValues.h;

            if (inputValue != prevVal) {
                $caller.val(value);
                if (dimension === "w") this.prevResizeValues.w = parseInt(<string><any>value);
                else this.prevResizeValues.h = parseInt(<string><any>value);
            }

            if (this.lockedRatio) {
                $target.val(Math.round(value * this.actions.state.getImageRatio(dimension, true)));
            }

            if (e.which === 13) submit();
            if (e.which === 27) cancel();
        }

        //TODO: this doesnt belong here
        private HandleRatioInputBlur($caller: JQuery, $target: JQuery, dimension: string) {
            //todo: -> settings/options
            const minRatio = 5;
            let value: number = $caller.val();
            let initialDimensionSize = this.actions.state.getImageInitialSize(dimension);

            value = value > initialDimensionSize
                ? initialDimensionSize
                : value >= initialDimensionSize / minRatio
                    ? value
                    : initialDimensionSize / minRatio;
            $caller.val(value);

            if (this.lockedRatio) {
                $target.val(Math.round(value * this.actions.state.getImageRatio(dimension, true)));
            }
        }

        //TODO: this doesnt belong here
        private BindResizeEventHandlers($w: JQuery, $h: JQuery, submit: () => void, cancel: () => void) {
            var _instance = this;
            this.prevResizeValues = { w: this.actions.state.imageW, h: this.actions.state.imageH };

            $w
                .keyup(function (e) {
                    _instance.HandleRatioInputKeyUp($(this), $h, Globals.ImageDimension.W, e, submit, cancel);
                })
                .blur(function () {
                    _instance.HandleRatioInputBlur($(this), $h, Globals.ImageDimension.W);
                });

            $h
                .keyup(function (e) {
                    _instance.HandleRatioInputKeyUp($(this), $w, Globals.ImageDimension.H, e, submit, cancel);
                })
                .blur(function () {
                    _instance.HandleRatioInputBlur($(this), $w, Globals.ImageDimension.H);
                });
        }

        _initializeUI($container: JQuery) {
            let parentId = $container.attr('id');
            let $uiContainer = $(`<div class="photo-editor-ui_container ${parentId}"></div>`);

            let $tabContainer = $('<div class="photo-editor-ui_tab-container"></div>');
            let $tab1 = $('<div data-id="1" class="active"></div>');
            let $tab2 = $('<div data-id="2"></div>');
            let $tab3 = $('<div data-id="3"></div>');

            let switchTabs = (caller) => {
                this.actions.init();
                let tabId = $(caller).attr('data-id');
                $(`.photo-editor-ui_container.${parentId} .photo-editor-ui_tab-container > div`).hide().removeClass('active');
                $(`.photo-editor-ui_container.${parentId} .photo-editor-ui_tab-container > div[data-id="${tabId}"]`).show().addClass('active');
                $(`.photo-editor-ui_container.${parentId} .photo-editor-ui_tab-control-container > span`).removeClass('active');
                $(caller).addClass('active');
            };

            let $tabControlContainer = $('<div class="photo-editor-ui_tab-control-container"></div>');
            let $tabControl1 = $(`<span data-id="1" class="active">${Globals.Texts.EditorNav.PictureSettings}</span>`).click(function () { switchTabs(this) });
            let $tabControl2 = $(`<span data-id="2">${Globals.Texts.EditorNav.FilterGalery}</span>`).click(function () { switchTabs(this) });
            let $tabControl3 = $(`<span data-id="3">${Globals.Texts.EditorNav.ColorSettings}</span>`).click(function () { switchTabs(this) });

            $tab1.append(this._getTab1Content($tab1));
            $tab2.append(this._getTab2Content($tab2));
            $tab3.append(this._getTab3Content($tab3));

            $tabContainer.append($tab1, $tab2, $tab3);
            $tabControlContainer.append($tabControl1, $tabControl2, $tabControl3);
            $uiContainer.append($tabControlContainer, $tabContainer);

            $container.append($uiContainer);
        }

        _getTab1Content($parent: JQuery) {
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
                        let $cancelCrop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Cancel, 'crop-cancel',
                            () => { this.actions._disposeSubControls(); this.actions.CancelCrop(); }
                        ));
                        let $submitCrop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Submit, 'crop-submit',
                            () => { this.actions._disposeSubControls(); this.actions.SubmitCrop(); }
                        ));
                        let $customCrop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.CropCustom, 'crop-custom',
                            ($caller) => { this.actions.CropCustom(); }
                        ));
                        let $squareCrop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.CropSquare, 'crop-square',
                            ($caller) => { this.actions.CropSquare(); }
                        ));
                        let $4to3Crop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Crop4to3, 'crop-4to3',
                            ($caller) => { this.actions.Crop4to3(); }
                        ));
                        let $16to9Crop = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Crop16to9, 'crop-16to9',
                            ($caller) => { this.actions.Crop16to6(); }
                        ));

                        this.actions.init(() => { this.actions._disposeSubControls(); this.actions.CancelCrop(); }, () => {
                            this.actions._createSubControls([$cancelCrop, $customCrop, $squareCrop, $4to3Crop, $16to9Crop, $submitCrop], $parent);
                        });
                    })
                }
            ));

            let $resize = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Resize, 'resize',
                () => {
                    let $widthInput = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(<string>(<any>this.actions.state.imageW), 'input-width', () => { }, 'input', Globals.Texts.Inputs.ResizeWidthPlch));
                    let $heightInput = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(<string>(<any>this.actions.state.imageH), 'input-height', () => { }, 'input', Globals.Texts.Inputs.ResizeHeightPlch));

                    var $lockRatioButton = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.LockRatio, `lock-ratio ${this.lockedRatio ? "active" : ""}`,
                        () => {
                            this.lockedRatio = !this.lockedRatio;
                            if (this.lockedRatio) {
                                $lockRatioButton.addClass('active');
                                $widthInput.keyup();
                            }
                            else {
                                $lockRatioButton.removeClass('active');
                            }
                        }
                    ));

                    let cancel = () => { this.actions._disposeSubControls(); }
                    let $cancelResize = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Cancel, 'resize-cancel',
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
                    let $submitResize = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Submit, 'resize-submit',
                        submit
                    ));


                    this.BindResizeEventHandlers($widthInput, $heightInput, submit, cancel);

                    this.actions.init(this.actions._disposeSubControls, () => {
                        this.actions._createSubControls([$cancelResize, $widthInput, $lockRatioButton, $heightInput, $submitResize], $parent);
                    });
                }
            ));

            let $fitToScreen = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.FitToScreen, 'fitToScreen',
                () => { this.actions.TriggerFitToScreen() }
            ));

            let $resetAll = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Resset, 'resetAll',
                () => { this.actions.Reset() }
            ));

            return [$crop, $rotateLeft, $rotateRight, $flipH, $flipV, $resize, $fitToScreen, $resetAll];
        }

        _getTab2Content($parent: JQuery) {
            return this.actions.GenerateFilterIcons();
        }

        _getTab3Content($parent: JQuery) {

            let $brightness = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Brightness, 'brightness',
                () => { this.actions.StartBrightness() }
            ));

            let $saturation = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Saturation, 'saturation',
                () => { this.actions.StartSaturation() }
            ));

            let $contrast = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Contrast, 'contrast',
                () => { this.actions.StartContrast() }
            ));

            let $exposure = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Exposure, 'exposure',
                () => { this.actions.StartExposure() }
            ));

            let $shadows = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Shadows, 'shadows',
                () => { this.actions.StartShadows() }
            ));

            let $highlights = Html.HTMLControls.GetButtonContol(new Html.HTMLButtonControl(Globals.Texts.Buttons.Highlights, 'highlights',
                () => { this.actions.StartHighlights() }
            ));

            return [$brightness, $saturation, $contrast, $exposure, $shadows, $highlights];
        }
    };
}


namespace PhotoEditor.Actions.SDK {

    export class BaseAction {

        editorIndex: number;
        state: ActionState;
        _lastExit(): void { };

        constructor(public reactUI: any, public sdk: any, public editor: any, public containerId: string, public image: HTMLImageElement) {
            this.sdk = sdk;
            this.editor = editor;
            this.containerId = containerId;
            this.editorIndex = sdk !== null ? Globals._editorInstances++ : -1;
            this.state = new ActionState(sdk);
            this._lastExit = null;

            if (sdk !== null) {
                var inresize = false;
                window.onresize = () => {
                    if (!inresize) setTimeout(() => {
                        this.state.originalZoom = sdk.getZoom();
                        inresize = false;
                    }, 1000);
                    inresize = true;
                };
            }
        }

        /**
        * Zoom editor to fit the image to screen
        * @param {Function} callback
        * @return {Number}
        */
        FitToScreen(callback) {
            let _outputDimensions = this.sdk.getOutputDimensions();
            let _canvas = this.sdk.getCanvas();
            //let $inner = $('.pesdk-react-canvasControls.pesdk-react-canvasControls__innerContainer');
            //let _canvas = { height: $inner.height(), width: $inner.width() };

            //console.log(this.state.originalZoom);

            let pixelRatio = parseFloat(<string><any>this._getDevicePixelRatio());
            let realCanvasH = _canvas.height / pixelRatio;
            let realCanvasW = _canvas.width / pixelRatio;

            //console.log(realCanvasW, realCanvasH);
            //console.log(_outputDimensions.x, _outputDimensions.y);

            let ratio = 1;
            if (_outputDimensions.y > realCanvasH) {
                ratio = realCanvasH / _outputDimensions.y;
            }

            if (_outputDimensions.x > realCanvasW) {
                let assignable = realCanvasW / _outputDimensions.x;
                ratio = assignable < ratio ? assignable : ratio;
            }
            //console.log(this.state.originalZoom * ratio);

            var zoomRatioToSet = this.state.originalZoom * ratio;

            this.editor.setZoom(zoomRatioToSet);
            this.editor.render();
            //window.dispatchEvent(new Event('resize'));

            if (typeof (callback) === 'function') callback();
            return zoomRatioToSet;
        }

        TriggerFitToScreen() {
            window.dispatchEvent(new Event('resize'));
        }

        /**
        * Reset orientation to its original state
        * @param {Function} callback
        * @param {boolean} render
        */
        ResetOrientation(callback, render: boolean = true) {
            var resolve = () => { if (typeof (callback) === 'function') callback(); };

            if (this.state.OrientationOperation !== null) {
                this.sdk.removeOperation(this.state.OrientationOperation);
                this.state.ResetOrientationState();

                if (render) this.FitToScreen(callback);
                else resolve();
            }
            else {
                resolve();
            }
        }

        /**
        * Reset sdk. Clears the operation stack and fits image to screen
        */
        Reset() {
            this.init(null, () => {
                this.state.ResetState();
                this.sdk.reset();
                this.sdk.setImage(this.image);
                window.dispatchEvent(new Event('resize'));
            });
        }

        Export(format, callback: (exportedImage: ExportedImage) => void, dispose) {
            this.init(null, () => {
                this.sdk.render().then(() => {
                    this.sdk.export(PhotoEditorSDK.RenderType.DATAURL, format, 1)
                        .then((image) => {
                            callback(new ExportedImage(image, this.image.src));
                            if (!!dispose) {
                                setTimeout(() => { this.DisposeEditor(true); }, 1000);
                            }
                        });
                });
            });
        }

        DisposeEditor(disposeSdk: boolean = false) {
            $('.pesdk-react-modals__button').click();
            if (disposeSdk) this.reactUI.dispose();
            var id = `#${this.containerId}-editor`;
            $(id).remove();
            $('.photo-editor-ui_container').remove();
            Html.HTMLControls.HideLoader();
            console.log(`${id} disposed`);
            Globals._editorDisposator = null;
        }

        /**
        * Executes any exit functions and assigns new one if any
        * @param {Function} newExit
        * @param {Function} callback
        */
        init(newExit = null, callback = null) {
            if (typeof (this._lastExit) === 'function') this._lastExit();
            this._lastExit = newExit;

            setTimeout(() => { if (typeof (callback) === 'function') callback(); }, 100);
        }

        ResizeImage(w: number, h: number, callback: () => void = null, render: boolean = true) {
            this.ResetOrientation(() => {
                this.init(null, () => {

                    this.RemoveCrop();

                    this.state.imageW = w;
                    this.state.imageH = h;
                    var dimensions = new PhotoEditorSDK.Math.Vector2(w, h);
                    this.sdk.setImage(this.sdk.getImage(), this.sdk.getExif(), dimensions);

                    if (render) this.FitToScreen(callback);
                    else if (typeof (callback) === 'function') callback();
                });
            }, false);
        }

        ResetPictureSettings() {
            this.init(null, () => {
                this.ResetOrientation(() => {
                    this.ResizeImage(this.state.initialImageW, this.state.initialImageH, () => {

                        this.RemoveCrop();

                        this.TriggerFitToScreen();
                    }, false);
                }, false);
            });
        }



        RemoveCrop() {
            let operationStack = this.editor.getOperationsStack();
            operationStack.forEach((v) => {
                if (v instanceof PhotoEditorSDK.Operations.CropOperation) {
                    this.editor.removeOperation(v);
                }
            });
        }

        /**
        * Gets filter image by filter name
        * @param {string} filterName
        * @return {string}
        */
        getFilterImageByName(filterName) {
            var path = `${Settings.APP_ROOT_PATH}img/filters/`;
            return path + filterName + '.png';
        }

        _getDevicePixelRatio() {
            var ratio = 1;
            // To account for zoom, change to use deviceXDPI instead of systemXDPI
            if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
                // Only allow for values > 1
                ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
            }
            else if (window.devicePixelRatio !== undefined) {
                ratio = window.devicePixelRatio;
            }
            return ratio;
        }

    }
}


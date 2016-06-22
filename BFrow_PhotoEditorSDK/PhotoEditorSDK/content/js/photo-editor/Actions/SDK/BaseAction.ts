
namespace PhotoEditor.Actions.SDK {

    export class BaseAction {

        editorIndex: number;
        state: ActionState;

        constructor(public sdk: any, public editor: any, public containerId: string, public image: HTMLImageElement) {
            this.sdk = sdk;
            this.editor = editor;
            this.containerId = containerId;
            this.editorIndex = sdk !== null ? Globals._editorInstances++ : -1;
            this.state = new ActionState(sdk)

            if (sdk !== null) {
                var inresize = false;
                window.onresize = () => {
                    if (!inresize) setTimeout(() => { this.state.originalZoom = sdk.getZoom(); inresize = false; }, 800);
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
            var _outputDimensions = this.sdk.getOutputDimensions();
            var _canvas = this.sdk.getCanvas();

            var ratio = 1;
            if (_outputDimensions.y > _canvas.height) {
                ratio = _canvas.height / _outputDimensions.y
            }
            if (_outputDimensions.x > _canvas.width) {
                ratio = _canvas.width / _outputDimensions.x
            }

            var zoomRatioToSet = ratio == 1
                ? this.state.originalZoom
                : this.state.originalZoom * ratio;

            this.sdk.setZoom(zoomRatioToSet);
            this.sdk.render();
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

            var hasOrientationOperations = this.state.RotationOperationStack.length > 0 || this.state.FlipOperationStack.length > 0;
            if (hasOrientationOperations) {

                this.state.ClearRotationStack();
                this.state.rotation = 0;

                this.state.ClearFlipStack();
                this.state.flippedH = false;
                this.state.flippedV = false;

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
                //TODO: -> buggy with combination with ReactUI - check on next release
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
                                setTimeout(() => { this.DisposeEditor(); }, 1000);
                            }
                        });
                });
            });
        }

        DisposeEditor() {
            //do not dispose sdk -> single instance
            //this.sdk.dispose();
            var id = `#${this.containerId}`;
            $(id).remove();
            console.log(`${id} disposed`);
        }

        /**
        * Executes any exit functions and assigns new one if any
        * @param {Function} newExit
        * @param {Function} callback
        */
        init(newExit = null, callback = null) {
            if (typeof (this.state._lastExit) === 'function') this.state._lastExit();
            this.state._lastExit = newExit;

            setTimeout(() => { if (typeof (callback) === 'function') callback(); }, 100);
        }

    }
}


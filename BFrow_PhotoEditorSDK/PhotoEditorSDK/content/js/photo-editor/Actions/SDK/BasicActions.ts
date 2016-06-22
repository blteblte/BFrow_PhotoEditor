
namespace PhotoEditor.Actions.SDK {

    export class BasicActions extends BaseAction {

        constructor(sdk: any, editor: any, containerId: string, image: HTMLImageElement) { super(sdk, editor, containerId, image) }

        Rotate(direction: Globals.RotateDirection) {
            this.init(null, () => {
                this.state.ClearRotationStack();

                var rotateOperation = new PhotoEditorSDK.Operations.OrientationOperation(this.sdk, {});
                var rotateTo = direction === Globals.RotateDirection.Left ? -90 : 90;
                rotateOperation.setRotation(this.state._getRotation(rotateTo));

                this.state.RotationOperationStack.push(rotateOperation);
                this.sdk.addOperation(rotateOperation);

                this.FitToScreen(null);
            });
        }

        Flip(dir: Globals.FlipDirection) {
            this.state.ClearFlipStack();

            var flipOperation = new PhotoEditorSDK.Operations.OrientationOperation(this.sdk, {});

            if (dir === Globals.FlipDirection.Horizontal) {
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
        }

        //todo: scetch
        ResizeImage(w: number, h: number) {
            this.ResetOrientation(() => {
                this.init(null, () => {
                    this.state.imageW = w;
                    this.state.imageH = h;
                    var dimensions = new PhotoEditorSDK.Math.Vector2(w, h);
                    this.sdk.setImage(this.image, this.sdk.getExif(), dimensions);
                    this.FitToScreen(null);
                });
            }, false);
        }
    }
}

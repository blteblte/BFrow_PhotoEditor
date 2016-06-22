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

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

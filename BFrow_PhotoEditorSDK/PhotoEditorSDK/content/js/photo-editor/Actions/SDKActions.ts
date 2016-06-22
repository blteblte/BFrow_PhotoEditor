

namespace PhotoEditor.Actions {

    export class SDKActions extends ReactUI.ReactUIOverlay {
        reactEditor: any;

        constructor(editor: any, internalInstance: any, containerId: string, image: HTMLImageElement) {
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

            super(_sdk, _internalEditor, containerId, image);
            this.reactEditor = _editor;
        }
    }

}

namespace PhotoEditorFrame {

    const GET_URL_PARAM = "url";
    const CONTAINER_ID = "photo-editor";

    export class EditorInstance {

        editorIndex: number = 0
        actions: PhotoEditor.Actions.SDKActions = null;

        LaunchEditor() {
            let imageUrl: string = this.GetImageUrl(GET_URL_PARAM);
            if (imageUrl !== null) {
                let editorInstance = new PhotoEditor.Editor.ImageEditor(CONTAINER_ID, this.editorIndex++, imageUrl);
                editorInstance.LoadEditor().then((actions: PhotoEditor.Actions.SDKActions) => {
                    this.actions = actions;
                });
            }
            else {
                throw (new Error("Image URL missing. Expected in 'GET' parameters as 'url'. Make sure its same origin."));
            }
        }

        private GetImageUrl(name: string, url: string = null) {
            if (url === null) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
    }
}

$(function () {
    (new PhotoEditorFrame.EditorInstance()).LaunchEditor();
});
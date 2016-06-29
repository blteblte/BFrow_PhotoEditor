namespace PhotoEditor.Handlers{
    /**
    * Use to assign handler for saving the image
    * @param {PhotoEditor.ExportedImage} exportedImage - {image: HTMLImageElement (base64 encoded blob), url: string (url of image original source)}
    */
    export var onSaveHandler: (exportedImage: ExportedImage) => void;
}
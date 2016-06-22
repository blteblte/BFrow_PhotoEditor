namespace PhotoEditor.Actions.SDK {

    export class ActionState {

        RotationOperationStack: Array<any>;
        FlipOperationStack: Array<any>;
        FilterOperationStack: Array<any>;
        originalZoom: any;
        wToHRatio: number;
        hToWRatio: number;
        initialImageW: number;
        initialImageH: number;
        imageW: number;
        imageH: number;
        rotation: number = 0;
        flippedH: boolean = false;
        flippedV: boolean = false;

        /**
        * Initialize new actions state
        * @param {any} sdk - instance of PhotoEditorSDK
        */
        constructor(public sdk) {
            this.originalZoom = sdk !== null ? sdk.getZoom() : 1;
            this.RotationOperationStack = [];
            this.FlipOperationStack = [];
            this.FilterOperationStack = [];

            var outputDimensions = sdk !== null ? sdk.getOutputDimensions() : null;
            if (outputDimensions !== null) {
                this.wToHRatio = outputDimensions.x / outputDimensions.y;
                this.hToWRatio = outputDimensions.y / outputDimensions.x;
            }

            var inputDimensions = sdk !== null ? sdk.getInputDimensions() : null;
            if (inputDimensions !== null) {
                this.imageW = inputDimensions.x;
                this.imageH = inputDimensions.y;
                this.initialImageW = this.imageW;
                this.initialImageH = this.imageH;
            }
        }

        /**
        * Reset values to initial
        */
        ResetState() {
            this.RotationOperationStack = [];
            this.FlipOperationStack = [];
            this.rotation = 0;
            this.flippedH = false;
            this.flippedV = false;
            this.imageW = this.initialImageW;
            this.imageH = this.initialImageH;
        }

        /**
        * Reset rotation operation values to initial
        */
        ClearRotationStack() {
            if (this.RotationOperationStack.length > 0) {
                this.RotationOperationStack.forEach((v) => {
                    this.sdk.removeOperation(v);
                });
                this.RotationOperationStack = [];
            }
        }

        /**
        * Reset flip operation values to initial
        */
        ClearFlipStack() {
            if (this.FlipOperationStack.length > 0) {
                this.FlipOperationStack.forEach((v) => {
                    this.sdk.removeOperation(v);
                });
                this.FlipOperationStack = [];
            }
        }

        /**
        * Get image dimension ratio for specified dimension or reverse
        * @param {PhotoEditor.Globals.ImageDimension} dimension
        * @param {boolean} toRatio - set true to get ratio to specified dimension, false to get ratio from specified dimension
        * @return {number}
        */
        getImageRatio(dimension: Globals.ImageDimension, toRatio: boolean = false) {
            return dimension == Globals.ImageDimension.W
                ? toRatio ? this.hToWRatio : this.wToHRatio
                : toRatio ? this.wToHRatio : this.hToWRatio;
        }

        /**
        * Get image initial size for specified dimension
        * @param {PhotoEditor.Globals.ImageDimension} dimension
        * @return {number}
        */
        getImageInitialSize(dimension: Globals.ImageDimension) {
            return dimension == Globals.ImageDimension.W
                ? this.initialImageW
                : this.initialImageH;
        }

        /**
        * Get image current size for specified dimension
        * @param {PhotoEditor.Globals.ImageDimension} dimension
        * @return {number}
        */
        getImageCurrentSize(dimension: Globals.ImageDimension) {
            return dimension == Globals.ImageDimension.W
                ? this.imageW
                : this.imageH;
        }

        /**
        * Get number to apply to rotate operation
        * @param {number} add
        * @return {number}
        */
        _getRotation(add: number) {
            this.rotation = this.rotation += add;
            if (this.rotation === -360) this.rotation = 0;
            if (this.rotation === 360) this.rotation = 0;
            return this.rotation;
        }
    }

}
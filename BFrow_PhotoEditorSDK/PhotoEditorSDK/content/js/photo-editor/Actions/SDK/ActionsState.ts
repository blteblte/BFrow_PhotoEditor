namespace PhotoEditor.Actions.SDK {

    export class ActionState {

        /**
        * Initialize new actions state
        * @param {any} sdk - instance of PhotoEditorSDK
        */
        constructor(public sdk) { }


        OrientationOperation: any = null;
        FilterOperation: any = null;
        AdjustmentOperation: any = null;

        private _originalZoom: number = null;
        get originalZoom(): number {
            if (this._originalZoom === null && this.sdk !== null) {
                this._originalZoom = this.sdk.getZoom();
            }
            return this._originalZoom;
        }
        set originalZoom(value: number) {
            this._originalZoom = value;
        }

        //private _wToHRatio: number = null;
        //get wToHRatio(): number {
        //    if (this._wToHRatio === null && this.sdk !== null) {
        //        let outputDimensions = this.sdk.getOutputDimensions();
        //        this._wToHRatio = outputDimensions.x / outputDimensions.y;
        //    }
        //    return this._wToHRatio;
        //}
        //set wToHRatio(value: number) {
        //    this._wToHRatio = value;
        //}

        //private _hToWRatio: number = null;
        //get hToWRatio(): number {
        //    if (this._hToWRatio === null && this.sdk !== null) {
        //        let outputDimensions = this.sdk.getOutputDimensions();
        //        this._hToWRatio = outputDimensions.y / outputDimensions.x;
        //    }
        //    return this._hToWRatio;
        //}
        //set hToWRatio(value: number) {
        //    this._hToWRatio = value;
        //}

        private _wToHRatio: number = null;
        get wToHRatio(): number {
            if (this._wToHRatio === null && this.sdk !== null) {
                let outputDimensions = this.sdk.getInputDimensions();
                this._wToHRatio = outputDimensions.x / outputDimensions.y;
            }
            return this._wToHRatio;
        }
        set wToHRatio(value: number) {
            this._wToHRatio = value;
        }

        private _hToWRatio: number = null;
        get hToWRatio(): number {
            if (this._hToWRatio === null && this.sdk !== null) {
                let outputDimensions = this.sdk.getInputDimensions();
                this._hToWRatio = outputDimensions.y / outputDimensions.x;
            }
            return this._hToWRatio;
        }
        set hToWRatio(value: number) {
            this._hToWRatio = value;
        }

        private _initialImageW: number = null;
        get initialImageW(): number {
            if (this._initialImageW === null && this.sdk !== null) {
                this._initialImageW = this.sdk.getInputDimensions().x;
            }
            return this._initialImageW;
        }

        private _initialImageH: number = null;
        get initialImageH(): number {
            if (this._initialImageH === null && this.sdk !== null) {
                this._initialImageH = this.sdk.getInputDimensions().y;
            }
            return this._initialImageH;
        }

        private _imageW: number = null;
        get imageW(): number {
            if (this._imageW === null) {
                this._imageW = this.initialImageW;
            }
            return this._imageW;
        }
        set imageW(value: number) {
            this._imageW = value;
        }

        private _imageH: number = null;
        get imageH(): number {
            if (this._imageH === null) {
                this._imageH = this.initialImageH;
            }
            return this._imageH;
        }
        set imageH(value: number) {
            this._imageH = value;
        }

        //orientation state
        rotation: number = 0;
        flippedH: boolean = false;
        flippedV: boolean = false;

        //addjustments state
        brightnessValue: number = Globals.AdjustmentSettings.GetAdjustmentSettings(Globals.AdjustmentTypes.Brightness).initial;
        saturationValue: number = Globals.AdjustmentSettings.GetAdjustmentSettings(Globals.AdjustmentTypes.Saturation).initial;
        contrastValue: number = Globals.AdjustmentSettings.GetAdjustmentSettings(Globals.AdjustmentTypes.Contrast).initial;
        exposureValue: number = Globals.AdjustmentSettings.GetAdjustmentSettings(Globals.AdjustmentTypes.Exposure).initial;
        shadowsValue: number = Globals.AdjustmentSettings.GetAdjustmentSettings(Globals.AdjustmentTypes.Shadows).initial;
        highlightsValue: number = Globals.AdjustmentSettings.GetAdjustmentSettings(Globals.AdjustmentTypes.Highlights).initial;

        adjustStateSaved = false;

        /**
        * Reset values to initial
        */
        ResetState() {
            this.rotation = 0;
            this.flippedH = false;
            this.flippedV = false;
            this.imageW = this.initialImageW;
            this.imageH = this.initialImageH;

            this.brightnessValue = Globals.AdjustmentSettings.GetAdjustmentSettings(Globals.AdjustmentTypes.Brightness).initial;
            this.saturationValue = Globals.AdjustmentSettings.GetAdjustmentSettings(Globals.AdjustmentTypes.Saturation).initial;
            this.contrastValue = Globals.AdjustmentSettings.GetAdjustmentSettings(Globals.AdjustmentTypes.Contrast).initial;
            this.exposureValue = Globals.AdjustmentSettings.GetAdjustmentSettings(Globals.AdjustmentTypes.Exposure).initial;
            this.shadowsValue = Globals.AdjustmentSettings.GetAdjustmentSettings(Globals.AdjustmentTypes.Shadows).initial;
            this.highlightsValue = Globals.AdjustmentSettings.GetAdjustmentSettings(Globals.AdjustmentTypes.Highlights).initial;
        }

        ResetOrientationState() {
            this.OrientationOperation = null;
            this.rotation = 0;
            this.flippedV = false;
            this.flippedH = false;
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
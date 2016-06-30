
namespace PhotoEditor.Actions.ReactUI {

    export class ReactUIOverlay extends ReactUIBase {
        constructor(public reactUI: any, sdk: any, editor: any, containerId: string, image: HTMLImageElement) { super(reactUI, sdk, editor, containerId, image) }

        StartCropping(initSubControls) {
            if (typeof (initSubControls) === 'function') initSubControls();
            else this.init(this.SubmitCrop, null);

            //this.ResetOrientation(() => {
                setTimeout(() => {
                    $(this._CropInitButtonSelector).click();
                    this._isInControl = true;
                }, 200);
            //});
        }

        CancelCrop() {
            $(this._CropCancelSelector).click();
            this._isInControl = false;
        }

        SubmitCrop() {
            $(this._CropSubmitSelector).click();
            this._isInControl = false;
            setTimeout(() => { this.state.originalZoom = this.sdk.getZoom(); }, 100);
        }

        CropCustom() {
            this._launchControl("custom", this._CropInitButtonSelector);
        }

        CropSquare() {
            this._launchControl("square", this._CropInitButtonSelector);
        }

        Crop4to3() {
            this._launchControl("4-3", this._CropInitButtonSelector);
        }

        Crop16to6() {
            this._launchControl("16-9", this._CropInitButtonSelector);
        }

        SubmitAdjust() {
            $(this._AdjustSubmitSelector).click();
            this._isInControl = false;
        }

        StartBrightness() {
            this.init(this.SubmitAdjust);
            this._launchControl("Brightness", this._AdjustInitButtonSelector);
        }

        StartSaturation() {
            this.init(this.SubmitAdjust);
            this._launchControl("Saturation", this._AdjustInitButtonSelector);
        }

        StartContrast() {
            this.init(this.SubmitAdjust);
            this._launchControl("Contrast", this._AdjustInitButtonSelector);
        }

        //v 3.3.0
        StartExposure() {
            this.init(this.SubmitAdjust);
            this._launchControl("Exposure", this._AdjustInitButtonSelector);
        }

        StartShadows() {
            this.init(this.SubmitAdjust);
            this._launchControl("Shadows", this._AdjustInitButtonSelector);
        }

        StartHighlights() {
            this.init(this.SubmitAdjust);
            this._launchControl("Highlights", this._AdjustInitButtonSelector);
        }
        //

        StartFilter(filter) {
            this.init(this.SubmitFilters, null);
            this._launchControl(filter, this._FiltersInitButtonSelector);
        }

        SubmitFilters() {
            $(this._FiltersSubmitSelector).click();
            this._isInControl = false;
        }

        //GenerateFilterIcons() {
        //    var filters = [];
        //    $.each(PhotoEditorSDK.Filters, (i, filter) => {
        //        if (
        //            filter.identifier !== 'k1'
        //            && filter.identifier !== 'k2'
        //            && filter.identifier !== 'k6'
        //            && filter.identifier !== 'kdynamic'
        //            && filter.identifier !== 'morning'
        //        ) {
        //            var $filterContainer = $('<div class="photo-editor-filter-item"></div>').click(() => {
        //                this.StartFilter(filter.identifier);
        //            });
        //            var $image = $(`<img src="${this.getFilterImageByName(filter.name)}" alt="" />`);
        //            var $nameItem = $(`<div>${filter.displayName}</div>`);

        //            $filterContainer.append($image, $nameItem);
        //            filters.push($filterContainer);
        //        }
        //    });
        //    return filters;
        //}
    }
}

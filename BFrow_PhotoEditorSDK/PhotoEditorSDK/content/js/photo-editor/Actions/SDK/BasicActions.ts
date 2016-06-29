
namespace PhotoEditor.Actions.SDK {

    export class BasicActions extends BaseAction {

        constructor(sdk: any, editor: any, containerId: string, image: HTMLImageElement) { super(sdk, editor, containerId, image) }

        Rotate(direction: Globals.RotateDirection) {
            this.init(null, () => {
                if (this.state.OrientationOperation == null) {
                    this.state.OrientationOperation = new PhotoEditorSDK.Operations.OrientationOperation(this.sdk, {});
                    this.sdk.addOperation(this.state.OrientationOperation);
                }

                var rotateTo = direction === Globals.RotateDirection.Left ? -90 : 90;
                this.state.OrientationOperation.setRotation(this.state._getRotation(rotateTo));

                //console.log(this.state.OrientationOperation);

                this.FitToScreen(null);
            });
        }

        Flip(dir: Globals.FlipDirection) {
            if (this.state.OrientationOperation == null) {
                this.state.OrientationOperation = new PhotoEditorSDK.Operations.OrientationOperation(this.sdk, {});
                this.sdk.addOperation(this.state.OrientationOperation);
            }

            if (dir === Globals.FlipDirection.Horizontal) {
                this.state.flippedH = !this.state.flippedH;
                this.state.OrientationOperation.setFlipHorizontally(this.state.flippedH);
            }
            else {
                this.state.flippedV = !this.state.flippedV;
                this.state.OrientationOperation.setFlipVertically(this.state.flippedV);
            }

            this.sdk.render();
        }

        Adjust(adjustmentType: Globals.AdjustmentTypes, value: number) {

            if (this.state.AdjustmentOperation == null) {
                this.state.AdjustmentOperation = new PhotoEditorSDK.Operations.AdjustmentsOperation(this.sdk, {});
                this.sdk.addOperation(this.state.AdjustmentOperation);
            }

            let settings = Globals.AdjustmentSettings.GetAdjustmentSettings(adjustmentType);

            switch(adjustmentType){
                case Globals.AdjustmentTypes.Brightness:
                    this.state.AdjustmentOperation.setBrightness(value);
                    this.state.brightnessValue = value * settings.multiplier;
                    break;
                case Globals.AdjustmentTypes.Saturation:
                    this.state.AdjustmentOperation.setSaturation(value);
                    this.state.saturationValue = value * settings.multiplier;
                    break;
                case Globals.AdjustmentTypes.Contrast:
                    this.state.AdjustmentOperation.setContrast(value);
                    this.state.contrastValue = value * settings.multiplier;
                    break;
                case Globals.AdjustmentTypes.Exposure:
                    this.state.AdjustmentOperation.setExposure(value);
                    this.state.exposureValue = value * settings.multiplier;
                    break;
                case Globals.AdjustmentTypes.Shadows:
                    this.state.AdjustmentOperation.setShadows(value);
                    this.state.shadowsValue = value * settings.multiplier;
                    break;
                case Globals.AdjustmentTypes.Highlights:
                    this.state.AdjustmentOperation.setHighlights(value);
                    this.state.highlightsValue = value * settings.multiplier;
                    break;
            }

            this.sdk.render();
        }

        GenerateFilterIcons() {
            var filters = [];
            $.each(PhotoEditorSDK.Filters, (i, filter) => {
                if (
                    filter.identifier !== 'k1'
                    && filter.identifier !== 'k2'
                    && filter.identifier !== 'k6'
                    && filter.identifier !== 'kdynamic'
                    && filter.identifier !== 'morning'
                    && filter.identifier !== 'lut'
                ) {
                    var $filterContainer = $(`<div class="photo-editor-filter-item ${filter.identifier}"></div>`).click(() => {
                        if (this.state.FilterOperation == null) {
                            this.state.FilterOperation = new PhotoEditorSDK.Operations.FilterOperation(this.sdk, {  });
                            this.sdk.addOperation(this.state.FilterOperation);
                        }

                        this.state.FilterOperation.setFilter(new filter());
                        this.sdk.render();

                    });
                    var $image = $(`<img src="${this.getFilterImageByName(filter.name)}" alt="" />`);
                    var $nameItem = $(`<div>${filter.displayName}</div>`);

                    $filterContainer.append($image, $nameItem);
                    filters.push($filterContainer);
                }
            });
            return filters;
        }

    }
}

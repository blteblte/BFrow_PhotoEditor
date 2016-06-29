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
                        if (_this.state.OrientationOperation == null) {
                            _this.state.OrientationOperation = new PhotoEditorSDK.Operations.OrientationOperation(_this.sdk, {});
                            _this.sdk.addOperation(_this.state.OrientationOperation);
                        }
                        var rotateTo = direction === PhotoEditor.Globals.RotateDirection.Left ? -90 : 90;
                        _this.state.OrientationOperation.setRotation(_this.state._getRotation(rotateTo));
                        //console.log(this.state.OrientationOperation);
                        _this.FitToScreen(null);
                    });
                };
                BasicActions.prototype.Flip = function (dir) {
                    if (this.state.OrientationOperation == null) {
                        this.state.OrientationOperation = new PhotoEditorSDK.Operations.OrientationOperation(this.sdk, {});
                        this.sdk.addOperation(this.state.OrientationOperation);
                    }
                    if (dir === PhotoEditor.Globals.FlipDirection.Horizontal) {
                        this.state.flippedH = !this.state.flippedH;
                        this.state.OrientationOperation.setFlipHorizontally(this.state.flippedH);
                    }
                    else {
                        this.state.flippedV = !this.state.flippedV;
                        this.state.OrientationOperation.setFlipVertically(this.state.flippedV);
                    }
                    this.sdk.render();
                };
                BasicActions.prototype.Adjust = function (adjustmentType, value) {
                    if (this.state.AdjustmentOperation == null) {
                        this.state.AdjustmentOperation = new PhotoEditorSDK.Operations.AdjustmentsOperation(this.sdk, {});
                        this.sdk.addOperation(this.state.AdjustmentOperation);
                    }
                    var settings = PhotoEditor.Globals.AdjustmentSettings.GetAdjustmentSettings(adjustmentType);
                    switch (adjustmentType) {
                        case PhotoEditor.Globals.AdjustmentTypes.Brightness:
                            this.state.AdjustmentOperation.setBrightness(value);
                            this.state.brightnessValue = value * settings.multiplier;
                            break;
                        case PhotoEditor.Globals.AdjustmentTypes.Saturation:
                            this.state.AdjustmentOperation.setSaturation(value);
                            this.state.saturationValue = value * settings.multiplier;
                            break;
                        case PhotoEditor.Globals.AdjustmentTypes.Contrast:
                            this.state.AdjustmentOperation.setContrast(value);
                            this.state.contrastValue = value * settings.multiplier;
                            break;
                        case PhotoEditor.Globals.AdjustmentTypes.Exposure:
                            this.state.AdjustmentOperation.setExposure(value);
                            this.state.exposureValue = value * settings.multiplier;
                            break;
                        case PhotoEditor.Globals.AdjustmentTypes.Shadows:
                            this.state.AdjustmentOperation.setShadows(value);
                            this.state.shadowsValue = value * settings.multiplier;
                            break;
                        case PhotoEditor.Globals.AdjustmentTypes.Highlights:
                            this.state.AdjustmentOperation.setHighlights(value);
                            this.state.highlightsValue = value * settings.multiplier;
                            break;
                    }
                    this.sdk.render();
                };
                BasicActions.prototype.GenerateFilterIcons = function () {
                    var _this = this;
                    var filters = [];
                    $.each(PhotoEditorSDK.Filters, function (i, filter) {
                        if (filter.identifier !== 'k1'
                            && filter.identifier !== 'k2'
                            && filter.identifier !== 'k6'
                            && filter.identifier !== 'kdynamic'
                            && filter.identifier !== 'morning'
                            && filter.identifier !== 'lut') {
                            var $filterContainer = $("<div class=\"photo-editor-filter-item " + filter.identifier + "\"></div>").click(function () {
                                if (_this.state.FilterOperation == null) {
                                    _this.state.FilterOperation = new PhotoEditorSDK.Operations.FilterOperation(_this.sdk, {});
                                    _this.sdk.addOperation(_this.state.FilterOperation);
                                }
                                _this.state.FilterOperation.setFilter(new filter());
                                _this.sdk.render();
                            });
                            var $image = $("<img src=\"" + _this.getFilterImageByName(filter.name) + "\" alt=\"\" />");
                            var $nameItem = $("<div>" + filter.displayName + "</div>");
                            $filterContainer.append($image, $nameItem);
                            filters.push($filterContainer);
                        }
                    });
                    return filters;
                };
                return BasicActions;
            })(SDK.BaseAction);
            SDK.BasicActions = BasicActions;
        })(SDK = Actions.SDK || (Actions.SDK = {}));
    })(Actions = PhotoEditor.Actions || (PhotoEditor.Actions = {}));
})(PhotoEditor || (PhotoEditor = {}));

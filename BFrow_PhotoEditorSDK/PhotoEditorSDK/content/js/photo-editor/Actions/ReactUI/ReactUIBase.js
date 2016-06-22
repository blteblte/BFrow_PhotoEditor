/* React UI */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PhotoEditor;
(function (PhotoEditor) {
    var Actions;
    (function (Actions) {
        var ReactUI;
        (function (ReactUI) {
            var ReactUIBase = (function (_super) {
                __extends(ReactUIBase, _super);
                function ReactUIBase(sdk, editor, containerId, image) {
                    _super.call(this, sdk, editor, containerId, image);
                    this._isInControl = false;
                    this._AdjustInitButtonSelector = '#' + containerId +
                        ' .pesdk-react-controls__button__icon[data-reactid=".'
                        + this.editorIndex
                        + '.1.1.2.0.0.0.0.0.0.$adjustments.0.0"]';
                    this._AdjustSubmitSelector = '#' + containerId +
                        ' .pesdk-react-controls__largeButton__icon[data-reactid=".'
                        + this.editorIndex
                        + '.1.1.2.0.0.1.0.0.0"]';
                    this._FiltersInitButtonSelector = '#' + containerId +
                        ' .pesdk-react-controls__button__icon[data-reactid=".'
                        + this.editorIndex
                        + '.1.1.2.0.0.0.0.0.0.$filter.0.0"]';
                    this._FiltersSubmitSelector = '#' + containerId +
                        ' .pesdk-react-controls__largeButton__icon[data-reactid=".'
                        + this.editorIndex
                        + '.1.1.2.0.0.1.0.0.0"]';
                    this._CropInitButtonSelector =
                        "#" + this.containerId + " .pesdk-react-controls__button__icon[data-reactid=\"." + this.editorIndex + ".1.1.2.0.0.0.0.0.0.$crop.0.0\"]";
                    this._CropCancelSelector =
                        "#" + this.containerId + " .pesdk-react-controls__largeButton__icon[data-reactid=\"." + this.editorIndex + ".1.1.2.0.0.0.0.0.0\"]";
                    this._CropSubmitSelector =
                        "#" + this.containerId + " .pesdk-react-controls__largeButton__icon[data-reactid=\"." + this.editorIndex + ".1.1.2.0.0.0.2.0.0\"]";
                }
                ReactUIBase.prototype._createSubControls = function (buttonControls, $target) {
                    var $subActionsContainer = $("<div class=\"photo-editor-ui_sub-controls-container\"></div>");
                    buttonControls.forEach(function (v, i) {
                        $subActionsContainer.append(v);
                    });
                    $target.append($subActionsContainer);
                };
                ReactUIBase.prototype._disposeSubControls = function () {
                    $("#" + this.containerId + " .photo-editor-ui_sub-controls-container").remove();
                };
                ReactUIBase.prototype._launchControl = function (operation, intitSelector) {
                    var _this = this;
                    if (!this._isInControl) {
                        $(intitSelector).click();
                        this._isInControl = true;
                        setTimeout(function () {
                            $(_this._findControl(operation)).click();
                        }, 100);
                    }
                    else {
                        $(this._findControl(operation)).click();
                    }
                };
                /**
                * Gets ReactUI jQuery selector for ReactUI control
                * @param {string} control - control identifier
                * @return {string}
                */
                ReactUIBase.prototype._findControl = function (control) {
                    var selector;
                    var $item = $("#" + this.containerId + " .pesdk-react-controls__list .pesdk-react-controls__list__item[data-reactid*=" + control.toLowerCase() + "]");
                    var dataid = $item.attr('data-reactid');
                    selector = "#" + this.containerId + " .pesdk-react-controls__list__item[data-reactid=\"" + dataid + "\"] .pesdk-react-controls__button";
                    //console.log(control, selector);
                    return selector;
                };
                //v 3.2.0
                //getFilterImageByName(filterName) {
                //    var path = 'content/js/PhotoEditorSDK/assets/ui/react/controls/filters/';
                //    //TODO: no switch needed here -> just use <filterName>.jpeg/.png for image names
                //    switch (filterName) {
                //        case 'IdentityFilter': return path + 'identity@2x.png';
                //        case 'A15Filter': return path + 'a15@2x.png';
                //        case 'BreezeFilter': return path + 'breeze@2x.png';
                //        case 'BWFilter': return path + 'bw@2x.png';
                //        case 'BWHardFilter': return path + 'bwhard@2x.png';
                //        case 'CelsiusFilter': return path + 'celsius@2x.png';
                //        case 'ChestFilter': return path + 'chest@2x.png';
                //        case 'FixieFilter': return path + 'fixie@2x.png';
                //        case 'FoodFilter': return path + 'food@2x.png';
                //        case 'FridgeFilter': return path + 'fridge@2x.png';
                //        case 'FrontFilter': return path + 'front@2x.png';
                //        case 'GlamFilter': return path + 'glam@2x.png';
                //        case 'GobblinFilter': return path + 'gobblin@2x.png';
                //        //case 'K1Filter': return path + 'k1@2x.png';
                //        //case 'K2Filter': return path + 'k2@2x.png';
                //        //case 'K6Filter': return path + 'k6@2x.png';
                //        //case 'KDynamicFilter': return path + 'kdynamic@2x.png';
                //        case 'LeninFilter': return path + 'lenin@2x.png';
                //        case 'LomoFilter': return path + 'lomo@2x.png';
                //        case 'MellowFilter': return path + 'mellow@2x.png';
                //        //case 'MorningFilter': return path + 'morning@2x.png';
                //        case 'OrchidFilter': return path + 'orchid@2x.png';
                //        case 'PolaFilter': return path + 'pola@2x.png';
                //        case 'Pola669Filter': return path + 'pola669@2x.png';
                //        case 'QuoziFilter': return path + 'quozi@2x.png';
                //        case 'SemiredFilter': return path + 'semired@2x.png';
                //        case 'SunnyFilter': return path + 'sunny@2x.png';
                //        case 'TexasFilter': return path + 'texas@2x.png';
                //        case 'X400Filter': return path + 'x400@2x.png';
                //    }
                //}
                //v 3.3.0
                /**
                * Gets filter image by filter name
                * @param {string} filterName
                * @return {string}
                */
                ReactUIBase.prototype.getFilterImageByName = function (filterName) {
                    var path = "content/js/PhotoEditorSDK/" + PhotoEditor.Globals.sdkVersionFolder + "/assets/ui/react/controls/filters/";
                    //TODO: no switch needed here -> just use <filterName>.jpeg/.png for image names
                    switch (filterName) {
                        case 'IdentityFilter': return path + 'identity@2x.png';
                        case 'A15Filter': return path + 'a15@2x.png';
                        case 'BreezeFilter': return path + 'breeze@2x.png';
                        case 'BWFilter': return path + 'bw@2x.png';
                        case 'BWHardFilter': return path + 'bwhard@2x.png';
                        case 'CelsiusFilter': return path + 'celsius@2x.png';
                        case 'ChestFilter': return path + 'chest@2x.png';
                        case 'FixieFilter': return path + 'fixie@2x.png';
                        case 'FoodFilter': return path + 'food@2x.png';
                        case 'FridgeFilter': return path + 'fridge@2x.png';
                        case 'FrontFilter': return path + 'front@2x.png';
                        case 'GlamFilter': return path + 'glam@2x.png';
                        case 'GobblinFilter': return path + 'gobblin@2x.png';
                        //case 'K1Filter': return path + 'k1@2x.png';
                        //case 'K2Filter': return path + 'k2@2x.png';
                        //case 'K6Filter': return path + 'k6@2x.png';
                        //case 'KDynamicFilter': return path + 'kdynamic@2x.png';
                        case 'LeninFilter': return path + 'lenin@2x.png';
                        case 'LomoFilter': return path + 'lomo@2x.png';
                        case 'MellowFilter': return path + 'mellow@2x.png';
                        case 'MetalFilter': return path + 'metal@2x.png';
                        //case 'MorningFilter': return path + 'morning@2x.png';
                        case 'OrchidFilter': return path + 'orchid@2x.png';
                        case 'PolaFilter': return path + 'pola@2x.png';
                        case 'Pola669Filter': return path + 'pola669@2x.png';
                        case 'QuoziFilter': return path + 'quozi@2x.png';
                        case 'SemiredFilter': return path + 'semired@2x.png';
                        case 'SunnyFilter': return path + 'sunny@2x.png';
                        case 'TexasFilter': return path + 'texas@2x.png';
                        case 'X400Filter': return path + 'x400@2x.png';
                        default: return path + 'identity@2x.png';
                    }
                };
                return ReactUIBase;
            })(Actions.SDK.BasicActions);
            ReactUI.ReactUIBase = ReactUIBase;
        })(ReactUI = Actions.ReactUI || (Actions.ReactUI = {}));
    })(Actions = PhotoEditor.Actions || (PhotoEditor.Actions = {}));
})(PhotoEditor || (PhotoEditor = {}));

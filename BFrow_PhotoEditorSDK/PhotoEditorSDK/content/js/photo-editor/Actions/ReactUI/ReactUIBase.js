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
                function ReactUIBase(reactUI, sdk, editor, containerId, image) {
                    _super.call(this, reactUI, sdk, editor, containerId, image);
                    this.reactUI = reactUI;
                    this._isInControl = false;
                    this._controlContainer = "#" + containerId + " .pesdk-react-controls.pesdk-react-controls__container.pesdk-react-controls__container__row .pesdk-react-controls__table > .pesdk-react-controls__cell.pesdk-react-controls__cell--list";
                    this._buttonContainer = "#" + containerId + "-editor > div > div:nth-child(3) > div.pesdk-react-editorScreen > div.pesdk-react-controls.pesdk-react-controls__container.pesdk-react-controls__container__row > div > div > div";
                    this._CropInitButtonSelector = this._controlContainer + " .pesdk-react-controls__list__item:nth-child(1) > div";
                    this._CropCancelSelector = this._buttonContainer + " > div:nth-child(1) > div";
                    this._CropSubmitSelector = this._buttonContainer + " > div:nth-child(3) > div";
                    //this._AdjustInitButtonSelector = '#' + containerId +
                    //    ' .pesdk-react-controls__button__icon[data-reactid=".'
                    //    + this.editorIndex
                    //    + '.1.1.2.0.0.0.0.0.0.$adjustments.0.0"]';
                    //this._AdjustSubmitSelector = '#' + containerId +
                    //    ' .pesdk-react-controls__largeButton__icon[data-reactid=".'
                    //    + this.editorIndex
                    //    + '.1.1.2.0.0.1.0.0.0"]';
                    //this._FiltersInitButtonSelector = '#' + containerId +
                    //    ' .pesdk-react-controls__button__icon[data-reactid=".'
                    //    + this.editorIndex
                    //    + '.1.1.2.0.0.0.0.0.0.$filter.0.0"]';
                    //this._FiltersSubmitSelector = '#' + containerId +
                    //    ' .pesdk-react-controls__largeButton__icon[data-reactid=".'
                    //    + this.editorIndex
                    //    + '.1.1.2.0.0.1.0.0.0"]';
                    //this._CropInitButtonSelector =
                    //    `#${this.containerId} .pesdk-react-controls__button__icon[data-reactid=".${this.editorIndex}.1.1.2.0.0.0.0.0.0.$crop.0.0"]`;
                    //this._CropCancelSelector =
                    //    `#${this.containerId} .pesdk-react-controls__largeButton__icon[data-reactid=".${this.editorIndex}.1.1.2.0.0.0.0.0.0"]`;
                    //this._CropSubmitSelector =
                    //    `#${this.containerId} .pesdk-react-controls__largeButton__icon[data-reactid=".${this.editorIndex}.1.1.2.0.0.0.2.0.0"]`;
                }
                ReactUIBase.prototype._createSubControls = function (buttonControls, $target, callback) {
                    if (callback === void 0) { callback = null; }
                    $("#" + this.containerId + " .photo-editor-ui_controls-container, #" + this.containerId + " .slick-dots").css({ opacity: "0", height: "0" });
                    var $subActionsContainer = $("<div class=\"photo-editor-ui_sub-controls-container\"></div>");
                    buttonControls.forEach(function (v, i) {
                        $subActionsContainer.append(v);
                    });
                    $target.append($subActionsContainer);
                    if (typeof (callback) === 'function')
                        callback();
                };
                ReactUIBase.prototype._disposeSubControls = function () {
                    $("#" + this.containerId + " .photo-editor-ui_controls-container, #" + this.containerId + " .slick-dots").css({ opacity: "1", height: "auto" });
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
                return ReactUIBase;
            })(Actions.SDK.BasicActions);
            ReactUI.ReactUIBase = ReactUIBase;
        })(ReactUI = Actions.ReactUI || (Actions.ReactUI = {}));
    })(Actions = PhotoEditor.Actions || (PhotoEditor.Actions = {}));
})(PhotoEditor || (PhotoEditor = {}));

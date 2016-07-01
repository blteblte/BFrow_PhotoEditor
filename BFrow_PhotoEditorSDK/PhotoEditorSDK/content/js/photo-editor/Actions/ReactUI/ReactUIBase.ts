/* React UI */

namespace PhotoEditor.Actions.ReactUI {

    export class ReactUIBase extends SDK.BasicActions {
        protected _isInControl: boolean;
        protected _AdjustInitButtonSelector: string;
        protected _AdjustSubmitSelector: string;
        protected _FiltersInitButtonSelector: string;
        protected _FiltersSubmitSelector: string;
        protected _CropInitButtonSelector: string;
        protected _CropCancelSelector: string;
        protected _CropSubmitSelector: string;

        private _controlContainer: string;
        private _buttonContainer: string;

        constructor(public reactUI: any, sdk: any, editor: any, containerId: string, image: HTMLImageElement) {
            super(reactUI, sdk, editor, containerId, image);
            this._isInControl = false;

            this._controlContainer = `#${containerId} .pesdk-react-controls.pesdk-react-controls__container.pesdk-react-controls__container__row .pesdk-react-controls__table > .pesdk-react-controls__cell.pesdk-react-controls__cell--list`;
            this._buttonContainer = `#${containerId}-editor > div > div:nth-child(3) > div.pesdk-react-editorScreen > div.pesdk-react-controls.pesdk-react-controls__container.pesdk-react-controls__container__row > div > div > div`;

            this._CropInitButtonSelector = `${this._controlContainer} .pesdk-react-controls__list__item:nth-child(1) > div`

            this._CropCancelSelector = `${this._buttonContainer} > div:nth-child(1) > div`;
            this._CropSubmitSelector = `${this._buttonContainer} > div:nth-child(3) > div`;

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

        _createSubControls(buttonControls: JQuery[], $target: JQuery, callback: () => void = null) {
            $(`#${this.containerId} .photo-editor-ui_controls-container, #${this.containerId} .slick-dots`).css({opacity: "0", height: "0"});
            let $subActionsContainer = $(`<div class="photo-editor-ui_sub-controls-container"></div>`);
            let $inner = $(`<div class="photo-editor-ui_sub-controls-inner"></div>`);
            buttonControls.forEach((v, i) => {
                $inner.append(v);
            });
            $target.append($subActionsContainer.append($inner));
            if (typeof(callback) === 'function') callback();
        }

        _disposeSubControls() {
            $(`#${this.containerId} .photo-editor-ui_controls-container, #${this.containerId} .slick-dots`).css({ opacity: "1", height: "auto" });
            $(`#${this.containerId} .photo-editor-ui_sub-controls-container`).remove();
        }

        _launchControl(operation, intitSelector) {
            if (!this._isInControl) {
                $(intitSelector).click();
                this._isInControl = true;
                setTimeout(() => {
                    $(this._findControl(operation)).click();
                }, 100);
            }
            else {
                $(this._findControl(operation)).click();
            }
        }

        /**
        * Gets ReactUI jQuery selector for ReactUI control
        * @param {string} control - control identifier
        * @return {string}
        */
        _findControl(control) {
            var selector;
            var $item = $(`#${this.containerId} .pesdk-react-controls__list .pesdk-react-controls__list__item[data-reactid*=${control.toLowerCase()}]`);
            var dataid = $item.attr('data-reactid');
            selector = `#${this.containerId} .pesdk-react-controls__list__item[data-reactid="${dataid}"] .pesdk-react-controls__button`;
            //console.log(control, selector);
            return selector;
        }

    }
}

/* React UI */
//NOT INCLUDED !!!
//DEPRECATED WITH 3.4.0+

namespace PhotoEditor.Actions.ReactUI {

    export class ReactUIBase_reactids extends SDK.BasicActions {
        protected _isInControl: boolean;
        protected _AdjustInitButtonSelector: string;
        protected _AdjustSubmitSelector: string;
        protected _FiltersInitButtonSelector: string;
        protected _FiltersSubmitSelector: string;
        protected _CropInitButtonSelector: string;
        protected _CropCancelSelector: string;
        protected _CropSubmitSelector: string;

        constructor(public reactUI: any, sdk: any, editor: any, containerId: string, image: HTMLImageElement) {
            super(reactUI, sdk, editor, containerId, image);
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
                `#${this.containerId} .pesdk-react-controls__button__icon[data-reactid=".${this.editorIndex}.1.1.2.0.0.0.0.0.0.$crop.0.0"]`;
            this._CropCancelSelector =
                `#${this.containerId} .pesdk-react-controls__largeButton__icon[data-reactid=".${this.editorIndex}.1.1.2.0.0.0.0.0.0"]`;
            this._CropSubmitSelector =
                `#${this.containerId} .pesdk-react-controls__largeButton__icon[data-reactid=".${this.editorIndex}.1.1.2.0.0.0.2.0.0"]`;
        }

        _createSubControls(buttonControls: JQuery[], $target: JQuery) {
            $(`#${this.containerId} .main-controls-button`).hide();
            var $subActionsContainer = $(`<div class="photo-editor-ui_sub-controls-container"></div>`);
            buttonControls.forEach((v, i) => {
                $subActionsContainer.append(v);
            });
            $target.append($subActionsContainer);
        }

        _disposeSubControls() {
            $(`#${this.containerId} .main-controls-button`).show();
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
        getFilterImageByName(filterName) {
            var path = `content/js/PhotoEditorSDK/${Globals.sdkVersionFolder}/assets/ui/react/controls/filters/`;

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
        }
    }
}

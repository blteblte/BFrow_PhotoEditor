namespace PhotoEditor.Html {

    export class EventBinder {

        lockedRatio: boolean = true;
        constructor(public actions: PhotoEditor.Actions.SDKActions) { }

        private prevResizeValues = { w: 0, h: 0 };
        private HandleRatioInputKeyUp($caller: JQuery, $target: JQuery, dimension: string, e: JQueryKeyEventObject
            , submit: () => void
            , cancel: () => void
        ) {
            let inputValue = $caller.val()
            let value: number = inputValue.replace(/[^0-9.]/g, '');
            let prevVal = dimension === Globals.ImageDimension.W ? this.prevResizeValues.w : this.prevResizeValues.h;

            if (inputValue != prevVal) {
                $caller.val(value);
                if (dimension === Globals.ImageDimension.W) this.prevResizeValues.w = parseInt(<string><any>value);
                else this.prevResizeValues.h = parseInt(<string><any>value);
            }

            if (this.lockedRatio) {
                $target.val(Math.round(value * this.actions.state.getImageRatio(dimension, true)));
            }

            if (e.which === 13) submit();
            if (e.which === 27) cancel();
        }

        private HandleRatioInputBlur($caller: JQuery, $target: JQuery, dimension: string) {
            const minRatio = Settings.MIN_RESIZE_RATE;
            let value: number = $caller.val();
            let initialDimensionSize = this.actions.state.getImageInitialSize(dimension);

            value = value > initialDimensionSize
                ? initialDimensionSize
                : value >= Math.round(initialDimensionSize / minRatio)
                    ? value
                    : Math.round(initialDimensionSize / minRatio);
            $caller.val(value);

            if (this.lockedRatio) {
                $target.val(Math.round(value * this.actions.state.getImageRatio(dimension, true)));
            }
        }

        BindResizeEventHandlers($w: JQuery, $h: JQuery, submit: () => void, cancel: () => void) {
            var _instance = this;
            this.prevResizeValues = { w: this.actions.state.imageW, h: this.actions.state.imageH };

            $w
                .keyup(function (e) {
                    _instance.HandleRatioInputKeyUp($(this), $h, Globals.ImageDimension.W, e, submit, cancel);
                })
                .blur(function () {
                    _instance.HandleRatioInputBlur($(this), $h, Globals.ImageDimension.W);
                });

            $h
                .keyup(function (e) {
                    _instance.HandleRatioInputKeyUp($(this), $w, Globals.ImageDimension.H, e, submit, cancel);
                })
                .blur(function () {
                    _instance.HandleRatioInputBlur($(this), $w, Globals.ImageDimension.H);
                });
        }


        BindSlider (type: Globals.AdjustmentTypes, adjustment: Globals.Adjustments, bindValue: number) {

            let instance = this;

            let $slider = $("#photo-editor-ui_slider");

            let getDisplayValue = (value) => {
                const sliderRange = parseFloat(<string><any>200);
                let normalizeMultiplier = sliderRange / parseFloat(<string><any>((adjustment.max) - (adjustment.min)));
                let overflow = (adjustment.max + adjustment.min) * (parseFloat(<string><any>normalizeMultiplier) / parseFloat(<string><any>(sliderRange / 100)));
                let normalized = (value * normalizeMultiplier) * 100 - overflow;

                return Math.round(normalized);
            }

            var $numBox = $(`<span class="ui-slider-numbox">${getDisplayValue(bindValue / adjustment.multiplier)}</span>`);

            $slider.slider({
                range: "min",
                min: adjustment.min,
                max: adjustment.max,
                value: bindValue,
                step: 0.01,
                slide: function (event, ui) {
                    var value = parseFloat(<string><any>(parseFloat(<string><any>ui.value) / parseFloat(<string><any>adjustment.multiplier))).toPrecision(4);
                    $numBox.text(getDisplayValue(value));
                    instance.actions.Adjust(type, parseFloat(value));
                    console.log(value);
                }
            });

            $slider.find(".ui-slider-handle").append($numBox);
        }

    }

}
var PhotoEditor;
(function (PhotoEditor) {
    var Html;
    (function (Html) {
        var EventBinder = (function () {
            function EventBinder(actions) {
                this.actions = actions;
                this.lockedRatio = true;
                this.prevResizeValues = { w: 0, h: 0 };
            }
            EventBinder.prototype.HandleRatioInputKeyUp = function ($caller, $target, dimension, e, submit, cancel) {
                var inputValue = $caller.val();
                var value = inputValue.replace(/[^0-9.]/g, '');
                var prevVal = dimension === PhotoEditor.Globals.ImageDimension.W ? this.prevResizeValues.w : this.prevResizeValues.h;
                if (inputValue != prevVal) {
                    $caller.val(value);
                    if (dimension === PhotoEditor.Globals.ImageDimension.W)
                        this.prevResizeValues.w = parseInt(value);
                    else
                        this.prevResizeValues.h = parseInt(value);
                }
                if (this.lockedRatio) {
                    $target.val(Math.round(value * this.actions.state.getImageRatio(dimension, true)));
                }
                if (e.which === 13)
                    submit();
                if (e.which === 27)
                    cancel();
            };
            EventBinder.prototype.HandleRatioInputBlur = function ($caller, $target, dimension) {
                //todo: -> settings/options
                var minRatio = 5;
                var value = $caller.val();
                var initialDimensionSize = this.actions.state.getImageInitialSize(dimension);
                value = value > initialDimensionSize
                    ? initialDimensionSize
                    : value >= Math.round(initialDimensionSize / minRatio)
                        ? value
                        : Math.round(initialDimensionSize / minRatio);
                $caller.val(value);
                if (this.lockedRatio) {
                    $target.val(Math.round(value * this.actions.state.getImageRatio(dimension, true)));
                }
            };
            EventBinder.prototype.BindResizeEventHandlers = function ($w, $h, submit, cancel) {
                var _instance = this;
                this.prevResizeValues = { w: this.actions.state.imageW, h: this.actions.state.imageH };
                $w
                    .keyup(function (e) {
                    _instance.HandleRatioInputKeyUp($(this), $h, PhotoEditor.Globals.ImageDimension.W, e, submit, cancel);
                })
                    .blur(function () {
                    _instance.HandleRatioInputBlur($(this), $h, PhotoEditor.Globals.ImageDimension.W);
                });
                $h
                    .keyup(function (e) {
                    _instance.HandleRatioInputKeyUp($(this), $w, PhotoEditor.Globals.ImageDimension.H, e, submit, cancel);
                })
                    .blur(function () {
                    _instance.HandleRatioInputBlur($(this), $w, PhotoEditor.Globals.ImageDimension.H);
                });
            };
            EventBinder.prototype.BindSlider = function (type, adjustment, bindValue) {
                var instance = this;
                var $slider = $("#photo-editor-ui_slider");
                var getDisplayValue = function (value) {
                    var sliderRange = 200;
                    var normalizeMultiplier = sliderRange / (adjustment.max - adjustment.min);
                    var overflow = (adjustment.max + adjustment.min) * (normalizeMultiplier / (sliderRange / 100));
                    var normalized = (value * normalizeMultiplier) * 100 - overflow;
                    return Math.round(normalized);
                };
                var $numBox = $("<span class=\"ui-slider-numbox\">" + getDisplayValue(bindValue / adjustment.multiplier) + "</span>");
                $slider.slider({
                    range: "min",
                    min: adjustment.min,
                    max: adjustment.max,
                    value: bindValue,
                    step: 0.01,
                    slide: function (event, ui) {
                        var value = parseFloat(ui.value) / adjustment.multiplier;
                        $numBox.text(getDisplayValue(value));
                        instance.actions.Adjust(type, value);
                    }
                });
                $slider.find(".ui-slider-handle").append($numBox);
            };
            return EventBinder;
        })();
        Html.EventBinder = EventBinder;
    })(Html = PhotoEditor.Html || (PhotoEditor.Html = {}));
})(PhotoEditor || (PhotoEditor = {}));

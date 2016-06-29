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
            return EventBinder;
        })();
        Html.EventBinder = EventBinder;
    })(Html = PhotoEditor.Html || (PhotoEditor.Html = {}));
})(PhotoEditor || (PhotoEditor = {}));

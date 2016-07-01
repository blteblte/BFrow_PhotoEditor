var PhotoEditor;
(function (PhotoEditor) {
    var Html;
    (function (Html) {
        //TODO: use interface
        var HTMLControls = (function () {
            function HTMLControls() {
            }
            HTMLControls.GetButtonContol = function (buttonControl) {
                var tag = buttonControl.tagName === null ? this.DEFAULT_DOM_ELEMENT : buttonControl.tagName;
                if (tag === 'input') {
                    return $("<" + tag + " type=\"text\" class=\"" + this.CSS_PREFIX + buttonControl.cssClass + "\" value=\"" + buttonControl.text + "\" placeholder=\"" + buttonControl.placeholder + "\" />")
                        .click(function () { buttonControl.onclick($(this)); });
                }
                else {
                    return $("<" + tag + " class=\"" + this.CSS_PREFIX + buttonControl.cssClass + " main-controls-button\">\n    <img src=\"" + PhotoEditor.Settings.APP_ROOT_PATH + "img/buttons/" + buttonControl.cssClass + ".png\" alt=\"\" />\n    <span>" + buttonControl.text + "</span>\n</" + tag + ">")
                        .click(function () { buttonControl.onclick($(this)); });
                }
            };
            HTMLControls.GetEditorContainer = function (containerselector) {
                return $("<div id=\"" + containerselector + "\" class=\"photo-editor-instance-container\"></div>");
            };
            HTMLControls.GetSlider = function () {
                return $("<div id=\"photo-editor-ui_slider\"></div>");
            };
            HTMLControls.GetSliderStaticBox = function () {
                return $('<span class="photo-editor-ui_slider-static-box">0</span>');
            };
            HTMLControls.ShowLoader = function ($appendTo, text) {
                $appendTo.append(this._getLoader(text));
            };
            HTMLControls.HideLoader = function () {
                this.$loader.remove();
            };
            HTMLControls._getLoader = function (text) {
                return this.$loader = $("<div class=\"photo-editor-ui_loader noselect\"><span class=\"photo-editor-ui_loader-text\">" + text + "</span></div>");
            };
            HTMLControls.DEFAULT_DOM_ELEMENT = 'div';
            HTMLControls.CSS_PREFIX = 'photo-editor-ui_';
            return HTMLControls;
        })();
        Html.HTMLControls = HTMLControls;
    })(Html = PhotoEditor.Html || (PhotoEditor.Html = {}));
})(PhotoEditor || (PhotoEditor = {}));

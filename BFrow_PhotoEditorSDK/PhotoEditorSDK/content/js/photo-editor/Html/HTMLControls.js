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
                    return $("<" + tag + " class=\"" + this.CSS_PREFIX + buttonControl.cssClass + "\">" + buttonControl.text + "</" + tag + ">")
                        .click(function () { buttonControl.onclick($(this)); });
                }
            };
            HTMLControls.DEFAULT_DOM_ELEMENT = 'button';
            HTMLControls.CSS_PREFIX = 'photo-editor-ui_';
            return HTMLControls;
        })();
        Html.HTMLControls = HTMLControls;
    })(Html = PhotoEditor.Html || (PhotoEditor.Html = {}));
})(PhotoEditor || (PhotoEditor = {}));

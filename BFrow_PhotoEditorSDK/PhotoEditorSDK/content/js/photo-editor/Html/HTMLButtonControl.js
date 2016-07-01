var PhotoEditor;
(function (PhotoEditor) {
    var Html;
    (function (Html) {
        var HTMLButtonControl = (function () {
            function HTMLButtonControl(text, cssClass, onclick, tagName, placeholder) {
                if (text === void 0) { text = ''; }
                if (tagName === void 0) { tagName = null; }
                if (placeholder === void 0) { placeholder = ''; }
                this.text = text;
                this.cssClass = cssClass;
                this.onclick = onclick;
                this.tagName = tagName;
                this.placeholder = placeholder;
            }
            return HTMLButtonControl;
        })();
        Html.HTMLButtonControl = HTMLButtonControl;
    })(Html = PhotoEditor.Html || (PhotoEditor.Html = {}));
})(PhotoEditor || (PhotoEditor = {}));

var PhotoEditor;
(function (PhotoEditor) {
    var imageEditorContainerCssClass = "image-editor";
    //just a test use-case scenario for multiple editors
    //
    var ImageContainer = (function () {
        function ImageContainer(caller, options) {
            this.editors = [];
            this.imageSources = [];
            this.intEditors = 0;
            this.$container = $(caller);
            this.appendEditorsToId = options.appendTo;
            this.disposeOnSave = options.disposeOnSave || false;
            this.$appendTo = $('#' + this.appendEditorsToId);
            this.currentEditor = 0;
        }
        ImageContainer.prototype.GetImages = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var $images = _this.$container.find('img');
                $.each($images, function (i, v) {
                    _this.imageSources.push($(v).attr('src'));
                });
                if (_this.imageSources.length > 0) {
                    resolve();
                }
                else {
                    reject();
                }
            });
        };
        ImageContainer.prototype.LoadEditors = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.imageSources.forEach(function (v, i, o) {
                    var newId = "editor-" + _this.$container.attr('id') + "-" + i;
                    var activeClass = "";
                    if (i == 0)
                        activeClass = "active";
                    var $editorContainer = $("<div class=\"" + imageEditorContainerCssClass + " " + activeClass + "\" id=\"" + newId + "\" data-id=\"" + i + "\"></div>");
                    _this.$appendTo.append($editorContainer);
                    var editor = new PhotoEditor.Editor.ImageEditor(newId, i, _this.imageSources[i]);
                    editor.LoadEditor().then(function (actions) {
                        _this.editors.push(editor);
                        _this.intEditors++;
                        if (_this.intEditors == _this.imageSources.length) {
                            resolve();
                        }
                    });
                });
            });
        };
        ImageContainer.prototype.InitNavigationUI = function () {
            var _this = this;
            if (this.imageSources.length > 0) {
                this.$navButtonContainer = $('<div class="photo-editor-ui_nav"></div>');
                this.$navPagingContainer = $('<div class="photo-editor-ui_nav-paging"></div>');
                var $backButton = $("<button>" + PhotoEditor.Globals.Texts.Nav.Back + "</button>").click(function () { _this.SwitchEditors(--_this.currentEditor); });
                var $forwardButton = $("<button>" + PhotoEditor.Globals.Texts.Nav.EditNextPicture + "</button>").click(function () { _this.SwitchEditors(++_this.currentEditor); });
                var $uploadAllButton = $("<button>" + PhotoEditor.Globals.Texts.Nav.UploadAll + "</button>").click(function () { _this.UploadAll(); });
                //var pagingButtons = [];
                //for (var i = 0; i < this.intEditors; i++) {
                //    var $pg = $('<span class="photo-editor-ui_pg-item" data-id="' + i + '"></span>').click(() => {
                //        this.SwitchEditors(currentEditor = i);
                //    });
                //    alert(i, this.intEditors);
                //    if (i === this.intEditors - 1) {
                //        $navPagingContainer.append(pagingButtons);
                //        this.$appendTo.prepend($navPagingContainer);
                //    }
                //}
                this.$navButtonContainer.append(/*$backButton, $forwardButton,*/ $uploadAllButton);
                this.$appendTo.append(this.$navButtonContainer);
            }
        };
        ImageContainer.prototype.SwitchEditors = function (index) {
            if (index >= 0 && index < this.intEditors) {
                $.each(this.editors, function (i, editor) {
                    if (editor.dataId === index) {
                        $("#" + editor.containerId).addClass('active');
                    }
                    else {
                        $("#" + editor.containerId).removeClass('active');
                        editor.actions.init(null, null);
                    }
                    if (index <= i) {
                        $(".photo-editor-ui_pg-item[data-id=\"" + i + "\"]").addClass('done');
                    }
                    else {
                        $(".photo-editor-ui_pg-item[data-id=\"" + i + "\"]").removeClass('done');
                    }
                });
            }
            else {
                this.currentEditor = this.currentEditor < 0 ? 0 : this.intEditors - 1;
            }
        };
        ImageContainer.prototype.UploadAll = function () {
            var _this = this;
            var items = [];
            $.each(this.editors, function (i, editor) {
                editor.actions.Export(PhotoEditorSDK.ImageFormat.JPEG, function (obj) {
                    items.push(obj);
                    if (i === _this.intEditors - 1)
                        finalize(items);
                }, _this.disposeOnSave //dispose
                );
            });
            var finalize = function (items) {
                $('#temp-preview').fadeIn(200);
                setTimeout(function () {
                    console.log(items);
                    //TODO: upload `items` to server as JSON
                    //TEST: temp display items
                    $('#temp-preview > div').html('');
                    $.each(items, function (i, v) {
                        $('#temp-preview > div').append('<img src="' + v.image + '" alt="" />');
                    });
                    //
                }, 1000);
                if (_this.disposeOnSave) {
                    _this.$navButtonContainer.remove();
                    _this.$navButtonContainer.remove();
                }
            };
        };
        ImageContainer.prototype.CloseWithoutSave = function () {
            $.each(this.editors, function (i, editor) {
                editor.actions.DisposeEditor();
            });
            this.$navButtonContainer.remove();
            this.$navButtonContainer.remove();
        };
        return ImageContainer;
    })();
    PhotoEditor.ImageContainer = ImageContainer;
})(PhotoEditor || (PhotoEditor = {}));

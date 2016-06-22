
namespace PhotoEditor {

    const imageEditorContainerCssClass = "image-editor";

    //just a test use-case scenario for multiple editors
    //
    export class ImageContainer {
        editors: Array<Editor.ImageEditor>;
        imageSources: Array<string>;
        $container: JQuery;
        $appendTo: JQuery;
        $navButtonContainer: JQuery;
        $navPagingContainer: JQuery;
        intEditors: number;
        appendEditorsToId: string;
        disposeOnSave: boolean;
        currentEditor: number;

        constructor(caller, options) {
            this.editors = [];
            this.imageSources = [];
            this.intEditors = 0;
            this.$container = $(caller);
            this.appendEditorsToId = options.appendTo;
            this.disposeOnSave = options.disposeOnSave || false;
            this.$appendTo = $('#' + this.appendEditorsToId);
            this.currentEditor = 0;
        }

        GetImages() {
            return new Promise((resolve, reject) => {
                var $images = this.$container.find('img');
                $.each($images, (i, v) => {
                    this.imageSources.push($(v).attr('src'));
                });

                if (this.imageSources.length > 0) {
                    resolve();
                }
                else {
                    reject();
                }
            });
        }

        LoadEditors() {
            return new Promise((resolve, reject) => {
                this.imageSources.forEach((v, i, o) => {
                    var newId = `editor-${this.$container.attr('id')}-${i}`;
                    var activeClass = "";
                    if (i == 0) activeClass = "active";

                    var $editorContainer = $(`<div class="${imageEditorContainerCssClass} ${activeClass}" id="${newId}" data-id="${i}"></div>`);
                    this.$appendTo.append($editorContainer);

                    var editor = new Editor.ImageEditor(newId, i, this.imageSources[i]);
                    editor.LoadEditor().then((actions) => {
                        this.editors.push(editor);
                        this.intEditors++;

                        if (this.intEditors == this.imageSources.length) {
                            resolve();
                        }
                    });
                });
            });
        }

        InitNavigationUI() {
            if (this.imageSources.length > 0) {
                this.$navButtonContainer = $('<div class="photo-editor-ui_nav"></div>');
                this.$navPagingContainer = $('<div class="photo-editor-ui_nav-paging"></div>')

                var $backButton = $(`<button>${Globals.Texts.Nav.Back}</button>`).click(() => { this.SwitchEditors(--this.currentEditor) });
                var $forwardButton = $(`<button>${Globals.Texts.Nav.EditNextPicture}</button>`).click(() => { this.SwitchEditors(++this.currentEditor) });
                var $uploadAllButton = $(`<button>${Globals.Texts.Nav.UploadAll}</button>`).click(() => { this.UploadAll(); });

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
        }

        SwitchEditors(index) {
            if (index >= 0 && index < this.intEditors) {
                $.each(this.editors, (i, editor) => {
                    if (editor.dataId === index) {
                        $(`#${editor.containerId}`).addClass('active');
                    }
                    else {
                        $(`#${editor.containerId}`).removeClass('active');
                        editor.actions.init(null, null);
                    }

                    if (index <= i) {
                        $(`.photo-editor-ui_pg-item[data-id="${i}"]`).addClass('done');
                    }
                    else {
                        $(`.photo-editor-ui_pg-item[data-id="${i}"]`).removeClass('done');
                    }
                });
            }
            else {
                this.currentEditor = this.currentEditor < 0 ? 0 : this.intEditors - 1;
            }
        }

        UploadAll() {
            var items: ExportedImage[] = [];
            $.each(this.editors, (i, editor) => {
                editor.actions.Export(
                    PhotoEditorSDK.ImageFormat.JPEG
                    , (obj) => {
                        items.push(obj);
                        if (i === this.intEditors - 1) finalize(items);
                    }
                    , this.disposeOnSave //dispose
                );
            });

            var finalize = (items: ExportedImage[]) => {
                $('#temp-preview').fadeIn(200);
                setTimeout(() => {
                    console.log(items);
                    //TODO: upload `items` to server as JSON

                    //TEST: temp display items
                    $('#temp-preview > div').html('');
                    $.each(items, (i, v) => {
                        $('#temp-preview > div').append('<img src="' + v.image + '" alt="" />');
                    });
                    //
                }, 1000);

                if (this.disposeOnSave) { this.$navButtonContainer.remove(); this.$navButtonContainer.remove(); }
            };
        }

        CloseWithoutSave() {
            $.each(this.editors, (i, editor) => {
                editor.actions.DisposeEditor();
            });
            this.$navButtonContainer.remove();
            this.$navButtonContainer.remove();
        }
    }
}


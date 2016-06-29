
namespace PhotoEditor.Html {

    //TODO: use interface
    export class HTMLControls {

        private static DEFAULT_DOM_ELEMENT: string = 'div';
        private static CSS_PREFIX: string = 'photo-editor-ui_';

        static GetButtonContol(buttonControl: HTMLButtonControl): JQuery {
            var tag: string = buttonControl.tagName === null ? this.DEFAULT_DOM_ELEMENT : buttonControl.tagName;
            if (tag === 'input') {
                return $(`<${tag} type="text" class="${this.CSS_PREFIX}${buttonControl.cssClass}" value="${buttonControl.text}" placeholder="${buttonControl.placeholder}" />`)
                    .click(function () { buttonControl.onclick($(this)); });
            }
            else {
                return $(
`<${tag} class="${this.CSS_PREFIX}${buttonControl.cssClass} main-controls-button">
    <img src="content/img/buttons/${buttonControl.cssClass}.png" alt="" />
    <span>${buttonControl.text}</span>
</${tag}>`
                )
                    .click(function () { buttonControl.onclick($(this)); });
            }
        }
    }
}
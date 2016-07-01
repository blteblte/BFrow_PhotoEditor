namespace PhotoEditor.Html {

    export class HTMLButtonControl {
        constructor(
            public text: string = '',
            public cssClass: string,
            public onclick: (caller: JQuery) => void,
            public tagName: string = null,
            public placeholder: string = ''
        )
        { }
    }
}
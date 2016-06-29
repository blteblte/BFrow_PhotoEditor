
//declare PhotoEditorSDK type
declare var PhotoEditorSDK: any;

//declare JQuery plugins
interface JQuery {
    slick: any;
}

//declare namespace PhotoEditorSDK.Math {
//    interface Vector2 {
//        x: number;
//        y: number;

//        abs(): Vector2;
//        add(addend: number | Vector2, y: number): Vector2;
//        ceil(): Vector2;
//        clamp(minimum: number | Vector2, maximum: number | Vector2): Vector2;
//        clone(): Vector2;
//        copy(other: Vector2): Vector2;
//        divide(divisor: number | Vector2, y: number): Vector2;
//        equals(vec: number | Vector2, y: number): boolean;
//        flip(): Vector2;
//        floor(): Vector2;
//        len(): number;
//        multiply(subtrahend: number | Vector2, y: number): Vector2;
//        round(): Vector2;
//        set(x: number, y: number): Vector2;
//        subtract(subtrahend: number | Vector2, y: number): Vector2;
//        toString(): string;
//    }
//}

//interface PhotoEditorSDK {
//    addOperation(operation);
//    createOperation(identifier, options, addToStack);
//    createRenderTexture();
//    dispose();
//    export(renderType, imageFormat, quality): Promise<any>;
//    getCanvas(): HTMLCanvasElement;
//    getContainer();
//    getExif();
//    getFinalDimensions(): PhotoEditorSDK.Math.Vector2;
//    getImage(): HTMLImageElement;
//    getInputDimensions(): PhotoEditorSDK.Math.Vector2;
//    getInputTexture();

//}
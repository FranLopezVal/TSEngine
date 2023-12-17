import { Engine } from "./engine";

export class Input {

    static OnKeyDown: (e: KeyboardEvent) => void = (e) => {};
    static OnKeyUp: (e: KeyboardEvent) => void = (e) => {};
    static OnMouseDown: (e: MouseEvent) => void = (e) => {};
    static OnMouseUp: (e: MouseEvent) => void = (e) => {};
    static OnMouseMove: (e: MouseEvent) => void = (e) => {};
    static OnMouseWheel: (e: WheelEvent) => void = (e) => {};
    static OnClick: (e: MouseEvent) => void = (e) => {};
    static OnDoubleClick: (e: MouseEvent) => void = (e) => {};
    static OnMouseLeave: (e: MouseEvent) => void = (e) => {};
    static OnMouseEnter: (e: MouseEvent) => void = (e) => {};

    static Init() {
        window.addEventListener("keydown", (e) => {
            Input.OnKeyDown(e);
        }, false);
        window.addEventListener("keyup", (e) => {
            Input.OnKeyUp(e);
        }, false);
        window.addEventListener("mousedown", (e) => {
            Input.OnMouseDown(e);
        }, false);
        window.addEventListener("mouseup", (e) => {
            Input.OnMouseUp(e);
        }, false);
        window.addEventListener("mousemove", (e) => {
            Input.OnMouseMove(e);
        }, false);
        window.addEventListener("wheel", (e) => {
            Input.OnMouseWheel(e);
        }, false);
        window.addEventListener("click", (e) => {
            Input.OnClick(e);
        }, false);
        window.addEventListener("dblclick", (e) => {
            Input.OnDoubleClick(e);
        }, false);
        window.addEventListener("mouseleave", (e) => {
            Input.OnMouseLeave(e);
        }, false);
        window.addEventListener("mouseenter", (e) => {
            Input.OnMouseEnter(e);
        }, false);




    }

    static get MousePosition() {
       return Engine.getInstance().renderer?._mousePosition;
    }

    static get RelativeMousePosition() {
        return {
            x: (Input.MousePosition!.x/Engine.getInstance().renderer!.width).toFixed(4), 
            y: (Input.MousePosition!.y/Engine.getInstance().renderer!.height).toFixed(4)
        };
    }

    static get PixelMousePosition() {
        return {
            x: ~~(Input.MousePosition!.x / Engine.RelationPixel), 
            y: ~~(Input.MousePosition!.y / Engine.RelationPixel)
        };
    }
}
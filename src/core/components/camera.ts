import { Component } from "../component";
import { Engine } from "../engine/engine";
import { gameObject } from "../gameObject";
import { vector2 } from "../math/v2";
import { Scene } from "../scene";

export class Rectangle {

    left = 0;
    top = 0;
    width = 0;
    height = 0;
    right = this.left + this.width;
    bottom = this.top + this.height;

    constructor(left: number, top: number, width: number, height: number) {
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }

    set(left: number, top: number, width: number | undefined = undefined,height: number | undefined = undefined) {
        this.left = left;
        this.top = top;
        this.width = width || this.width;
        this.height = height || this.height
        this.right = (this.left + this.width);
        this.bottom = (this.top + this.height);
    }

    within(r: { left: number; right: number; top: number; bottom: number; }) {
        return (r.left <= this.left &&
            r.right >= this.right &&
            r.top <= this.top &&
            r.bottom >= this.bottom);
    }

    overlaps(r: { right: number; left: number; bottom: number; top: number; }) {
        return (this.left < r.right &&
            r.left < this.right &&
            this.top < r.bottom &&
            r.top < this.bottom);
    }
}


export class Camera extends Component {
    public static mainCamera: Camera | null = null;
    public static cameras: Camera[] = [];

    private _active: boolean = false;
    private _backgroundColor: string = "#000000";
    private _viewPortWidth: number = 0;
    private _viewPortHeight: number = 0;
    
    private _cameraScale: number = 1;
    private _cameraRotation: number = 0;
    private _viewport: vector2 = vector2.zero();
    private _viewportRect: Rectangle = new Rectangle(0, 0, 0, 0);

    targetFollow: gameObject | null = null;
    get viewportRect() {
        return this._viewportRect;
    }

    get active() {
        return this._active;
    }

    get position() {
        return this.parent?.transform?.position!;
    }

    set position(position: vector2) {
        this.parent!.transform!.position =(position);
    }

    set active(active: boolean) {
        if (Camera.mainCamera) {
            Camera.mainCamera.active = false;
            Camera.mainCamera = null;
        }
        Camera.mainCamera = this;
        this._active = active;
    }
    get backgroundColor() {
        return this._backgroundColor;
    }
    set backgroundColor(backgroundColor: string) {
        this._backgroundColor = backgroundColor;
    }
    get viewport() {
        return this._viewport;
    }
    set viewport(viewport: vector2) {
        this._viewport = viewport;
    }

    constructor(parent: gameObject, viewPortWidth: number, cameraHeight: number, cameraPosition: vector2 = vector2.zero(), cameraScale: number = 1, cameraRotation: number = 0,
    target: gameObject | null = null) {
        super(parent);
        this._viewPortWidth = viewPortWidth;
        this._viewPortHeight = cameraHeight;
        this.position = cameraPosition;
        this._cameraScale = cameraScale;
        this._cameraRotation = cameraRotation;
        Camera.cameras.push(this);
        if (!Camera.mainCamera) {
            Camera.mainCamera = this;
        }

        this.backgroundColor = "#067";
        this.targetFollow = target;
    }

    OnCameraUpdate(target: gameObject | null, xDeadZone: number = 20, yDeadZone: number = 20) {
        
    }
}
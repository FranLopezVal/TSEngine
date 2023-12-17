import { Component } from "../component";
import { Engine } from "../engine/engine";
import { gameObject } from "../gameObject";
import { vector2 } from "../math/v2";

export class Sprite extends Component {

    private _image: HTMLImageElement | null = null;
    private _loaded: boolean = false;
    private _size: number = 1;
    private _multisprite: vector2 = vector2.one();
    private _currentFrame: vector2 = vector2.zero();
    private _castShadows: boolean = false;
    private _drawOnBack: boolean = false;

    get Image() {
        return this._image;
    }

    get Loaded() {
        return this._loaded;
    }

    get Size() {
        return this._size;
    }

    set Size(size: number) {
        this._size = size;
    }

    get multisprite() {
        return this._multisprite;
    }

    get currentFrame() {
        return this._currentFrame;
    }

    set currentFrame(frame: vector2) {
        this._currentFrame = frame;
    }

    get castShadows() {
        return this._castShadows;
    }

    set castShadows(cast: boolean) {
        this._castShadows = cast;
    }

    get drawOnBack() {
        return this._drawOnBack;
    }

    constructor(parent: gameObject, texture: string,multisprite: vector2 = vector2.one(), backgroundColorToTransparent: number[] | null = null,drawOnBack: boolean = false) {
        super(parent);
        this._image = new Image();
        this._image.src = texture;
        this._drawOnBack = drawOnBack;
        this._image.onload = () => {
            if (!this._loaded) {
                if (backgroundColorToTransparent) {
                    this.clearImage(backgroundColorToTransparent);
                }
                if (this._image) {
                    this._image.width = (this._size * Engine.RelationPixel)*multisprite.x;
                    this._image.height = (this._size * Engine.RelationPixel)*multisprite.y;
                    this._multisprite = multisprite;
                }
                this._loaded = true;
            }
        }
    }

    private clearImage(backgroundColor: number[] = [255, 255, 255]) {
        {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = this._image?.width!;
            canvas.height = this._image?.height!;

            context?.drawImage(this._image!, 0, 0, this._image?.width!, this._image?.height!);

            const imageData = context?.getImageData(0, 0, this._image?.width!, this._image?.height!);
            const data = imageData!.data;
            for (let i = 0; i < data.length; i += 4) {

                if (
                    data[i] === backgroundColor[0] &&
                    data[i + 1] === backgroundColor[1] &&
                    data[i + 2] === backgroundColor[2]
                ) {
                    data[i] = 0;
                    data[i + 1] = 0;
                    data[i + 2] = 0;
                    data[i + 3] = 0;
                }
            }
            context?.putImageData(imageData!, 0, 0);
            this._image!.src = canvas.toDataURL();

            canvas.remove();
        };
    }
}
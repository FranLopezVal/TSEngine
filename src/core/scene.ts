import { gameObject, vector2 } from "../main";
import {IObject} from "./ifaces/iobject";

export class Scene {

    static _current: Scene | null = null;

    _objects: gameObject[];
    _size: vector2 = vector2.zero();

    get current() {
        return Scene._current;
    }

    set current(scene: Scene | null) {
        if (Scene._current) {
            Scene._current = null;
        }
        Scene._current = this;
        Scene._current = scene;
    }

    constructor(Size: vector2) {
        this._objects = [];
        this._size = Size;
        if (!Scene._current) {
            Scene._current = this;
        }
    }

    get size() {
        return this._size;
    }

    set size(size: vector2) {
        this._size = size;
    }

    get objects() {
        return this._objects;
    }
    addObject(obj: gameObject) {
        this._objects.push(obj);
    }
    removeObject(obj: gameObject) {
        const index = this._objects.indexOf(obj);
        if (index > -1) {
            this._objects.splice(index, 1);
        }
    }
    getObjects() {
        return this._objects;
    }

    getObjectsByName(name: string) {
        let _objects: gameObject[] = [];
        this._objects.forEach((obj: gameObject) => {
            if (obj.name == name) {
                _objects.push(obj);
            }
        });
        return _objects;
    }

    Update() {
        for (let i = 0; i < this._objects.length; i++) {
            this._objects[i].OnUpdate();
            if (this._objects[i].getComponents().length > 0) {
                this._objects[i].InternalUpdate();
            }
        }
    }
}
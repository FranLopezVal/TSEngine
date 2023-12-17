import { gameObject } from "./gameObject";
import {IComponent} from "./ifaces/icomponent";
import {IObject} from "./ifaces/iobject";

export abstract class Component implements IComponent {
   
    protected _name: string = '';
    protected _id: number = 0;

    private _parent: gameObject | null = null;

    constructor(parent: gameObject) {
        this.parent = parent;
    }

    get parent() {
        return this._parent;
    }
    set parent(parent: gameObject | null) {
        if (parent === null) {
            throw new Error("Cannot set parent to null");
        }
        this._parent = parent;
    }

    OnLoad(): void {
        
    }
    OnUpdate(): void {
        
    }
    OnDestroy(): void {
        
    }

}

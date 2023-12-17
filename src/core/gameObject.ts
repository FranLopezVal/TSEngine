import { quaternion2, vector2 } from "../main";
import { Transform } from "./components/transform";
import {IComponent} from "./ifaces/icomponent";
import {IObject} from "./ifaces/iobject";

export class gameObject implements IObject {
    
    protected _name: string = '';
    protected _id: number = 0;
    protected _components: IComponent[];

    get id(): number {
        return this._id;
    }

    constructor(name: string = 'gameObject', id: number = 0,position: vector2 | {x:number,y:number} = vector2.zero(),
    rotation: quaternion2 = quaternion2.identity(),  components: IComponent[] = []) {
        if(components)
            this._components = components;
        else
            this._components = [];

        this._components.push(new Transform(this))

        if(this.transform) {
            if (position instanceof vector2)
                this.transform.position = position;
            else
                this.transform.position = new vector2(position.x, position.y);
            this.transform.rotation = rotation;
        }

        this._name = name;
        this._id = id;
    }

    OnLoad: () => void = () => { };
    OnUpdate: () => void = () => { };
    InternalUpdate() 
    {
        this._components!.forEach((component: IComponent) => {
            component.OnUpdate();
        });
    
    }
    get name(): string {
        return this._name;
    }

    get transform(): Transform | null {
        return this.getComponent<Transform>(Transform);
    }    

    getComponent<T>(componentType: new (...args: any[]) => T): T | null {
        let _comp: T | null = null;
        
        this._components.forEach((component) => {
            if (component instanceof componentType) {
                _comp = component;
            }
        });
        
        return _comp;
    }

    addComponent<T extends IComponent>(comp: T): void {
        if (this.hasComponent(comp.constructor as new () => T)) {
            return;
        }
        this._components.push(comp);
    }
    
    hasComponent<T extends IComponent>(componentType: new (...args: any[]) => T): boolean {
        let _has: boolean = false;
        this._components.forEach((component) => {
            if (component instanceof componentType) {
                _has = true;
            }
        });
        return _has;
    }

    removeComponent<T extends IComponent>(componentType: new () => T): void {
        this._components.forEach((component, index) => {
            if (component instanceof componentType) {
                this._components.splice(index, 1);
            }
        });
    }

    getComponents(): any[] {
        return this._components;
    }
    OnDestroy(): void {
        this._components = [];
    }
    
}
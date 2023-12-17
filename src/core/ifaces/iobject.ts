import { Transform } from "../components/transform";
import {IComponent} from "./icomponent";

export interface IObject {
    get transform(): Transform | null;
    OnLoad:()=>void;
    OnUpdate:()=>void;
    InternalUpdate():void;
    getComponent<T>(type: { new(): T }): T | null;
    addComponent<T extends IComponent>(comp: T): void;
    removeComponent<T extends IComponent>(componentType: new () => T): void;
    hasComponent<T extends IComponent>(componentType: new (...args: any[]) => T): boolean;
    getComponents(): any[];
    OnDestroy(): void;
}
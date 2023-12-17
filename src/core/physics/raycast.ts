import { Collider } from "../components/collider";
import { Rigidbody } from "../components/rigidbody";
import { Engine } from "../engine/engine";
import { vector2 } from "../math/v2";
import { Scene } from "../scene";

export class Raycast {
    private static _instance: Raycast;

    private constructor() { }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public raycast(origin: vector2, direction: vector2, distance: number): RaycastHit | null {
        let hit: RaycastHit | null = null;
        const colliders = Engine.getInstance().renderer?.allColliders;
        if (!colliders) return null;
        for (let i = 0; i < colliders.length; i++) {

            const hitpoint = colliders[i].checkRaycast(origin, direction, distance);
            if (hitpoint) {
                if (vector2.distance(origin, hitpoint) < distance)
                    {
                        hit = new RaycastHit(colliders[i], Number((vector2.distance(origin, hitpoint)).toFixed(4)));
                    }
                
            }
        }
        return hit;
    }
}

export class RaycastHit {
    public collider: Collider;
    public distance: number;

    constructor(collider: Collider, distance: number) {
        this.collider = collider;
        this.distance = distance;
    }
}
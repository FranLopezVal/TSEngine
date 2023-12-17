import { Engine } from "../../main";
import { Collider } from "../components/collider";
import { Rigidbody } from "../components/rigidbody";


export class PhysicsManager {
    private static _instance: PhysicsManager;

    private constructor() { }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public SimulatePhysics(sceneColliders: Array<Collider>) {
        for (let i = 0; i < sceneColliders.length; i++) {
            const rb = sceneColliders[i].parent?.getComponent<Rigidbody>(Rigidbody);
            if (rb)
                for (let j = 0; j < sceneColliders.length; j++) {
                    if (i != j) {
                        const sender = sceneColliders[i];
                        sender.inVerticalCollision = rb.checkVerticalCollision(sceneColliders[j])!;
                        rb.checkHorizontalCollision(sceneColliders[j]);
                    }
                }
            rb?.simulate(Engine.getInstance().deltaTimeSeconds!)
        }
    }




}
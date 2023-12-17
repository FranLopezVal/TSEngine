import { Component } from "../component";
import { Engine } from "../engine/engine";
import { gameObject } from "../gameObject";
import { quaternion2 } from "../math/q2";
import { vector2 } from "../math/v2";
import { Raycast } from "../physics/raycast";
import { Collider } from "./collider";

export class Rigidbody extends Component {

    public static gravity: vector2 = new vector2(0, 9.8);
    public static maxAcceleration: vector2 = new vector2(100, 100);

    private _velocity: vector2 = vector2.zero();
    private _acceleration: vector2 = vector2.zero();
    private _mass: number = 1;
    private _drag: number = 2;
    private _useGravity: boolean = true;
    private _isKinematic: boolean = false;
    private _freezeRotation: boolean = false;
    private _freezePosition: boolean = false;


    //#region Getters and Setters

    public get velocity(): vector2 {
        return this._velocity;
    }
    public set velocity(value: vector2) {
        this._velocity = value;
    }
    public get acceleration(): vector2 {
        return this._acceleration;
    }
    public set acceleration(value: vector2) {
        this._acceleration = value;
    }
    public get mass(): number {
        return this._mass;
    }
    public set mass(value: number) {
        this._mass = value;
    }
    public get drag(): number {
        return this._drag;
    }
    public set drag(value: number) {
        this._drag = value;
    }
    public get useGravity(): boolean {
        return this._useGravity;
    }
    public set useGravity(value: boolean) {
        this._useGravity = value;
    }
    public get isKinematic(): boolean {
        return this._isKinematic;
    }
    //#endregion


    constructor(parent: gameObject) {
        super(parent);
    }

    addForce(force: vector2, mode: 'impulse' | 'force' = 'force') {
        if (mode == 'force') {
            this._acceleration = this._acceleration.add(force.divInt(this._mass));
        } else {
            this._velocity = this._velocity.add(force.divInt(this._mass));
        }
    }

    simulate(deltaTime: number) {
        if (this._freezePosition) return;

        if (this._useGravity)
        {
            this._acceleration.y += Rigidbody.gravity.y / 10;
            this._acceleration = this._acceleration.add(Rigidbody.gravity);
        }
        
        this._velocity = this._velocity.add(this._acceleration.mulInt(deltaTime));
        this._acceleration = this._acceleration.divInt(1 + (this._drag * deltaTime));
        
        this.applyColliderFriction();
        this.parent!.transform!.position = this.parent!.transform!.position.add(this._velocity);
    }

    applyColliderFriction() {
        const collider = this.parent!.getComponent<Collider>(Collider)!;
        if (collider.friction == 0) return;
        if (this._velocity.x > 0) {
            this._velocity.x -= collider.friction;
        } else if (this._velocity.x < 0) {
            this._velocity.x += collider.friction;
        }
        if (!this._useGravity) {
            if (this._velocity.y > 0) {
                this._velocity.y -= collider.friction;
            } else if (this._velocity.y < 0) {
                this._velocity.y += collider.friction;
            }
        }
    }

    checkVerticalCollision(other: Collider) {
        
        const thisCollider = this.parent!.getComponent<Collider>(Collider)!;
        if (thisCollider.isTrigger || other.isTrigger || thisCollider == other) return;
        
        if (this.isKinematic) return;

        const thisBounds = thisCollider.bounds;
        const otherBounds = other.bounds;
        if (!thisCollider || thisCollider.isTrigger || other.isTrigger) return;
        // if a collision exists
        if (
            thisBounds.left <=
            otherBounds.right &&
            thisBounds.right >=
            otherBounds.left &&
            thisBounds.bottom >=
            otherBounds.top &&
            thisBounds.top <=
            otherBounds.bottom
        ) {
            if (this.velocity.y < 0) {
                this._acceleration.y = 0
                this._velocity.y = 0
                const offset = thisBounds.top - this.parent?.transform?.position.y!
                this.parent!.transform!.position.y =
                    otherBounds.top + otherBounds.height - offset + 1
                return;
            }
            else if (this.velocity.y > 0) {
                this._acceleration.y = 0
                this._velocity.y = 0
                const offset =
                    thisBounds.top - this.parent?.transform?.position.y! + thisBounds.height
                this.parent!.transform!.position.y = otherBounds.top - offset - 1
                return;
            }
        }
        
    }

    checkHorizontalCollision(other: Collider) {
        
        const thisCollider = this.parent!.getComponent<Collider>(Collider)!;
        if (thisCollider.isTrigger || other.isTrigger || thisCollider == other) return;
        if (this.isKinematic) return;
        const thisBounds = thisCollider.bounds;
        const otherBounds = other.bounds;

        // if a collision exists
        if (
            thisBounds.left <=
            otherBounds.right &&
            thisBounds.right >=
            otherBounds.left &&
            thisBounds.bottom >=
            otherBounds.top &&
            thisBounds.top <=
            otherBounds.bottom
        ) {
            if (this.velocity.x < 0) {
                this._velocity.x = 0
                this._acceleration.x = 0
                const offset = thisBounds.left - this.parent?.transform?.position.x!
                this.parent!.transform!.position.x =
                    otherBounds.left + otherBounds.width - offset + 1
                return;
            }
            else if (this.velocity.x > 0) {
                this._velocity.x = 0
                this._acceleration.x = 0
                const offset =
                    thisBounds.left - this.parent?.transform?.position.x! + thisBounds.width
                this.parent!.transform!.position.x = otherBounds.left - offset - 1
                return;
            }
        }
    }

}

/***
 * 
 * if (this._freezePosition) return;

        if (this._useGravity)
        {
            this._acceleration.y += Rigidbody.gravity.y / 10;
            this._acceleration = this._acceleration.add(Rigidbody.gravity);
        }
        
        // this._velocity = this._velocity.add(this._acceleration.mulInt(deltaTime));
        this._velocity.x =  this.velocity.x + (deltaTime * this._acceleration.x);
        this._velocity.y =  this.velocity.y + (deltaTime * this._acceleration.y);

        // this._acceleration = this._acceleration.divInt(1 + (this._drag * deltaTime));

        this._acceleration.x = this.acceleration.x / (1 + (this._drag * deltaTime));
        this._acceleration.y = this.acceleration.y / (1 + (this._drag * deltaTime));

        // this._velocity = this._velocity.divInt(1 + (this._drag * deltaTime));

        this.velocity.x = this.velocity.x / (1 + (this._drag * deltaTime));
        this.velocity.y = this.velocity.y / (1 + (this._drag * deltaTime));
        this.parent!.transform!.position.x += this._velocity.x;
        this.parent!.transform!.position.y += this._velocity.y;

        // apply collider friction
        this.applyColliderFriction();
 */
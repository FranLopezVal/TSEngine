import { Component } from "../component";
import { gameObject } from "../gameObject";
import { vector2 } from "../math/v2";
import { Rectangle } from "./camera";

export class Collider extends Component {

    private _isTrigger: boolean = false;

    private _colliderType: string = "box";
    private _colliderOffset: vector2 = vector2.zero();

    private _bounds: Rectangle = new Rectangle(0, 0, 64, 64);
    private _colliderCenter: vector2 = vector2.zero();

    inVerticalCollision: boolean = false;

    friction: number = 0.1;

    constructor(parent: gameObject, bounds: Rectangle = new Rectangle(0, 0, 64, 64)) {
        super(parent);
        this._bounds = bounds;
    }

    get colliderPosition() {
        return this.parent?.transform?.position!;
    }

    set Offset(offset: vector2) {
        this._colliderOffset = offset;
    }
    get bounds() {
        return new Rectangle(this.colliderPosition.x + this._colliderOffset.x, this.colliderPosition.y + this._colliderOffset.y, this._bounds.width, this._bounds.height);
    }

    get colliderCenter() {

        this._colliderCenter.x = this.bounds.left + (this.bounds.width / 2);
        this._colliderCenter.y = this.bounds.right + (this.bounds.height / 2);

        return this._colliderCenter;
    }

    get isTrigger() {
        return this._isTrigger;
    }

    get colliderType() {
        return this._colliderType;
    }

    checkCollision(other: Collider) {
        if (this.colliderType == "box" && other.colliderType == "box") {
            return this.bounds.overlaps(other.bounds);
        }
        return false;
    }
    
    checkCollisionWithPoint(point: vector2) {
        if (point.x >= this.bounds.left && point.x <= this.bounds.right && point.y >= this.bounds.top && point.y <= this.bounds.bottom) {
            return true;
        }
        return false;
    }

    checkRaycast(origin: vector2, direction: vector2, distance: number) {
        const lineEnd = origin.add(direction.mulInt(distance));
        
        const topLeft = new vector2(this.bounds.left, this.bounds.top);
        const topRight = new vector2(this.bounds.right, this.bounds.top);
        const bottomLeft = new vector2(this.bounds.left, this.bounds.bottom);
        const bottomRight = new vector2(this.bounds.right, this.bounds.bottom);

        const top = this.checkIntersection(origin, lineEnd, topLeft, topRight);
        const bottom = this.checkIntersection(origin, lineEnd, bottomLeft, bottomRight);
        const left = this.checkIntersection(origin, lineEnd, topLeft, bottomLeft);
        const right = this.checkIntersection(origin, lineEnd, topRight, bottomRight);

        const intersections: { point: vector2, distance: number }[] = [];

        if (top) {
            intersections.push({ point: top, distance: origin.distance(top) });
        }
        if (bottom) {
            intersections.push({ point: bottom, distance: origin.distance(bottom) });
        }
        if (left) {
            intersections.push({ point: left, distance: origin.distance(left) });
        }
        if (right) {
            intersections.push({ point: right, distance: origin.distance(right) });
        }

        if (intersections.length == 0) {
            return null;
        }

        let closestPoint = intersections[0];
        intersections.forEach((point) => {
            if (point.distance < closestPoint.distance) {
                closestPoint = point;
            }
        });

        return closestPoint.point;
    }

    checkIntersection(origin: vector2, lineEnd: vector2, point1: vector2, point2: vector2) {
        const denominator = ((lineEnd.x - origin.x) * (point2.y - point1.y)) - ((lineEnd.y - origin.y) * (point2.x - point1.x));
        
        if (denominator == 0) {
            return null;
        }
        const numerator1 = ((origin.y - point1.y) * (point2.x - point1.x)) - ((origin.x - point1.x) * (point2.y - point1.y));
        const numerator2 = ((origin.y - point1.y) * (lineEnd.x - origin.x)) - ((origin.x - point1.x) * (lineEnd.y - origin.y));
        
        
        if (numerator1 == 0 || numerator2 == 0) {
            return null;
        }
        const r = numerator1 / denominator;
        const s = numerator2 / denominator;

        
        const intersection = vector2.zero();
        intersection.x = origin.x + (r * (lineEnd.x - origin.x));
        intersection.y = origin.y + (r * (lineEnd.y - origin.y));
        if (r >= -200 && r <= 200 && s >= -200 && s <= 200) {
            return intersection;
        }
        return null;
        
    }
}
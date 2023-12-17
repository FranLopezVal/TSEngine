export class vector2 {

    _x: number = 0;
    _y: number = 0;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x | 0;
    }

    get y() {
        return this._y | 0;
    }

    set x(x: number) {
        this._x = x;
    }

    set y(y: number) {
        this._y = y;
    }

    add(v: vector2) {
        return new vector2(this._x + v.x, this._y + v.y);
    }

    sub(v: vector2) {
        return new vector2(this._x - v.x, this._y - v.y);
    }

    mul(v: vector2) {
        return new vector2(this._x * v.x, this._y * v.y);
    }
    mulInt(v: number) {
        return new vector2(this._x * v, this._y * v);
    }

    div(v: vector2) {
        return new vector2(this._x / v.x, this._y / v.y);
    }

    divInt(v: number) {
        return new vector2((this._x / v) | 0, (this._y / v) | 0);
    }

    scale(s: number) {
        return new vector2(this._x * s, this._y * s);
    }

    dot(v: vector2) {
        return this._x * v.x + this._y * v.y;
    }

    length() {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    normalize() {
        let len = this.length();
        return new vector2(this._x / len, this._y / len);
    }

    magnitude() {
        return this.length();
    }

    cross(v: vector2) {
        return this._x * v.y - this._y * v.x;
    }

    angle(v: vector2) {
        return Math.atan2(this.cross(v), this.dot(v));
    }

    static fromScalar(s: number) {
        return new vector2(s, s);
    }

    distance(v: vector2) : number {
        return Math.sqrt(Math.pow(this._x - v.x, 2) + Math.pow(this._y - v.y, 2));
    }

    direction(v: vector2) {
        return Math.atan2(v.y - this._y, v.x - this._x);
    }

    clamp(max: vector2) {
        return new vector2(Math.min(this._x, max.x), Math.min(this._y, max.y));
    }

    static Distance(v1: vector2, v2: vector2) {
        return v1.distance(v2);
    }

    static zero() {
        return new vector2(0, 0);
    }

    static one() {
        return new vector2(1, 1);
    }

    static up() {
        return new vector2(0, 1);
    }

    static down() {
        return new vector2(0, -1);
    }

    static left() {
        return new vector2(-1, 0);
    }

    static right() {
        return new vector2(1, 0);
    }

    static lerp(v1: vector2, v2: vector2, t: number) {
        return v1.scale(1 - t).add(v2.scale(t)).normalize();
    }

    static distance(v1: vector2, v2: vector2) {
        return v1.sub(v2).length();
    }

    static angle(v1: vector2, v2: vector2) {
        return Math.acos(v1.dot(v2) / (v1.length() * v2.length()));
    }

    static fromAngle(angle: number) {
        return new vector2(Math.cos(angle), Math.sin(angle));
    }

    static dot(v1: vector2, v2: vector2) {
        return v1.dot(v2);
    }

    static normalize(v: vector2) {
        return v.normalize();
    }
    
}
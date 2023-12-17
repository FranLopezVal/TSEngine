import { vector2 } from "./v2";

export class quaternion2 {

    _x: number;
    _y: number;
    _z: number;
    _w: number;

    constructor(x: number, y: number, z: number, w: number) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get z() {
        return this._z;
    }

    get w() {
        return this._w;
    }

    set x(x: number) {
        this._x = x;
    }

    set y(y: number) {
        this._y = y;
    }

    set z(z: number) {
        this._z = z;
    }

    set w(w: number) {
        this._w = w;
    }

    static identity() {
        return new quaternion2(0, 0, 0, 1);
    }

    static fromAxisAngle(axis: vector2, angle: number) {
        let halfAngle = angle / 2;
        let sin = Math.sin(halfAngle);
        let cos = Math.cos(halfAngle);
        return new quaternion2(axis.x * sin, axis.y * sin, 0, cos);
    }

    static fromEuler(x: number, y: number, z: number) {
        let qx = quaternion2.fromAxisAngle(new vector2(1, 0), x);
        let qy = quaternion2.fromAxisAngle(new vector2(0, 1), y);
        let qz = quaternion2.fromAxisAngle(new vector2(0, 0), z);
        return qx.mul(qy).mul(qz);
    }

    static fromVector(v: vector2) {
        return new quaternion2(v.x, v.y, 0, 0);
    }

    static fromScalar(s: number) {
        return new quaternion2(0, 0, 0, s);
    }

    add(q: quaternion2) {
        return new quaternion2(this._x + q.x, this._y + q.y, this._z + q.z, this._w + q.w);
    }

    sub(q: quaternion2) {
        return new quaternion2(this._x - q.x, this._y - q.y, this._z - q.z, this._w - q.w);
    }

    mul(q: quaternion2) {
        let x = this._x * q.w + this._y * q.z - this._z * q.y + this._w * q.x;
        let y = -this._x * q.z + this._y * q.w + this._z * q.x + this._w * q.y;
        let z = this._x * q.y - this._y * q.x + this._z * q.w + this._w * q.z;
        let w = -this._x * q.x - this._y * q.y - this._z * q.z + this._w * q.w;
        return new quaternion2(x, y, z, w);
    }

    mulInt(s: number) {
        return new quaternion2(this._x * s, this._y * s, this._z * s, this._w * s);
    }

    div(q: quaternion2) {
        return new quaternion2(this._x / q.x, this._y / q.y, this._z / q.z, this._w / q.w);
    }

    scale(s: number) {
        return new quaternion2(this._x * s, this._y * s, this._z * s, this._w * s);
    }

    dot(q: quaternion2) {
        return this._x * q.x + this._y * q.y + this._z * q.z + this._w * q.w;
    }

    length() {
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    }

    normalize() {
        let len = this.length();
        return new quaternion2(this._x / len, this._y / len, this._z / len, this._w / len);
    }

    conjugate() {
        return new quaternion2(-this._x, -this._y, -this._z, this._w);
    }

    inverse() {
        return this.conjugate().scale(1 / this.length());
    }

    static lerp(q1: quaternion2, q2: quaternion2, t: number) {
        return q1.scale(1 - t).add(q2.scale(t)).normalize();
    }

    static slerp(q1: quaternion2, q2: quaternion2, t: number) {
        let dot = q1.dot(q2);
        if (dot < 0) {
            q1 = q1.scale(-1);
            dot = -dot;
        }
        if (dot > 0.9995) {
            return quaternion2.lerp(q1, q2, t);
        }
        let theta = Math.acos(dot) * t;
        let q3 = q2.sub(q1.scale(dot)).normalize();
        return q1.scale(Math.cos(theta)).add(q3.scale(Math.sin(theta)));
    }

    static dot(q1: quaternion2, q2: quaternion2) {
        return q1.dot(q2);
    }

    static qlength(q: quaternion2) {
        return q.length();
    }

    static normalize(q: quaternion2) {
        return q.normalize();
    }


}
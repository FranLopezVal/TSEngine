import { Component } from "../component";
import { gameObject } from "../gameObject";
import { IObject } from "../ifaces/iobject";
import { quaternion2 } from "../math/q2";
import { vector2 } from "../math/v2";

export class Transform extends Component {
    
    _position: vector2 = new vector2(0, 0);
    _rotation: quaternion2 = new quaternion2(0, 0, 0, 1);  
    
    get position(): vector2 {
        return this._position;
    }

    set position(pos: vector2) {
        this._position = pos;
    }

    get rotation(): quaternion2 {
        return this.rotation;
    }

    set rotation(rotation: quaternion2) {
        this._rotation = rotation;
    }

    constructor(parent: gameObject, position: vector2 = new vector2(0, 0), rotation: quaternion2 = new quaternion2(0, 0, 0, 1)) {
        super(parent);
        this.position = position;
        this.rotation = rotation;
    }
}
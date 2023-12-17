import { Component } from "../component";
import { Engine } from "../engine/engine";
import { gameObject } from "../gameObject";
import { vector2 } from "../math/v2";
import { Scene } from "../scene";
import { Sprite } from "./sprite";

export enum LightShape {
    circle,
    square,
    horizontal,
    vertical
}

export class Light extends Component {

    radius: number = 100;
    color: string = 'ffff99';
    intensity: number = 1;
    shape: LightShape = LightShape.circle;

    shadowYOffset: number = 16;
    shadowStrength: number = .2;
    shadowRadius: number = 20;
    shadows: boolean = true;

    constructor(parent: gameObject, radius: number, color: string = 'ffff99', intensity: number = .2, shape: LightShape = LightShape.circle
        , shadows: boolean = true, shadowRadius: number = 20, shadowStrength: number = .2, shadowYOffset: number = 16) {
        super(parent);
        this.radius = radius;
        this.color = color;
        this.intensity = intensity;
        this.shape = shape;
        this.shadows = shadows;
        this.shadowRadius = shadowRadius;
        this.shadowStrength = shadowStrength;
        this.shadowYOffset = shadowYOffset;
    }

    simulateShadows() {
        if (!this.shadows) return;
        let ctx = Engine.getInstance().renderer?.getContext()!;
        if (ctx) {
            let spritesInRadius = this.getSpritesInRadius();
            spritesInRadius.forEach(s => {
                let spritePosition = s.transform?.position!;
                if (spritePosition) {
                    ctx.save();
                    ctx.globalCompositeOperation = 'darken';
                    ctx.imageSmoothingQuality = 'low';
                    ctx.fillStyle = `rgba(0,0,0,${this.shadowStrength})`;
                    ctx.beginPath();
                    const shadowPosition = this.calculatePositionShadow(spritePosition!).add(new vector2(0, this.shadowYOffset));



                    ctx.arc(shadowPosition.x, shadowPosition.y, this.shadowRadius, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.fill();
                    ctx.globalCompositeOperation = 'color';
                    ctx.restore();
                }
            });
        }
    }

    centerOfLight() {
        return new vector2(this.parent?.transform?.position!.x!, this.parent?.transform?.position!.y!);
    }


    calculatePositionShadow(positionObject: vector2): vector2 {
        const posobj = positionObject.add(new vector2(Engine.RelationPixel / 2, Engine.RelationPixel / 2));
        let centerOfLight = this.centerOfLight();
        let vectorCenterToSprite = posobj.sub(centerOfLight);
        let distance = 10;
        const destancebetween = centerOfLight.distance(posobj);
        let direction = vectorCenterToSprite.normalize();
        let positionShadow = centerOfLight.add(direction.mulInt(distance + destancebetween));
        return positionShadow;
    }

    getSpritesInRadius() {
        let sprites: gameObject[] = [];
        let allSprites = Scene._current?._objects.filter(g => g.hasComponent<Sprite>(Sprite) && g.getComponent<Sprite>(Sprite)?.castShadows);
        if (allSprites) {
            allSprites.forEach(sprite => {
                if (this.centerOfLight().distance(sprite.transform?.position!.add(new vector2(Engine.RelationPixel / 2, Engine.RelationPixel / 2))!) <= this.radius
                    && sprite != this.parent) {
                    sprites.push(sprite);
                }
            });
        }
        return sprites;
    }



}
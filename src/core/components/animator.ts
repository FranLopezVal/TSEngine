import { Component } from "../component";
import { Engine } from "../engine/engine";
import { gameObject } from "../gameObject";
import { Animation } from "../utils/animation";
import { Sprite } from "./sprite";

export class Animator extends Component 
{
    private _sprite: Sprite | null = null;
    private _animations: Animation[] = [];
    private _currentAnimation: Animation | null = null;

    private _animationstartTime: number = 0;
    private _animationTimer: number = 0;
    private _animationIndexFrame: number = 0;

    constructor(parent: gameObject, animations: Animation[]) {
        super(parent);
        if (parent.hasComponent<Sprite> == null) {
            throw new Error("Error: Animator needs Sprite component");
        }
        this._sprite = parent.getComponent<Sprite>(Sprite);
        this._animations = animations;
    }

    InitAnimation(name: string) {
        this._currentAnimation = this._animations?.find((anim) => anim.key == name)!;
        if (this._currentAnimation) {
            this._animationstartTime = Engine.getInstance().totalTime!;
        }
        this._sprite!.currentFrame = this._currentAnimation?.getFrame(this._animationIndexFrame).position!;

    }

    updateAnimation(deltaTime: number)
    {
        this._animationTimer += deltaTime * this._currentAnimation?.animationSpeed!;
        if (this._animationTimer >= this._currentAnimation?.getFrame(this._animationIndexFrame).timeExecution!) {
            this._animationIndexFrame++;
            this._animationTimer = 0;
            if (this._animationIndexFrame >= this._currentAnimation?.keyFrames.length!) {
                this._animationIndexFrame = 0;
            }
            this._sprite!.currentFrame = this._currentAnimation?.getFrame(this._animationIndexFrame).position!;
        }
    }

    endAnimation() {
        this._currentAnimation = null;
        this._animationstartTime = 0;
        this._animationTimer = 0;
        this._animationIndexFrame = 0;
    }

    OnUpdate(): void {
        if (this._sprite) {
            if(this._currentAnimation)
                this.updateAnimation(Engine.getInstance().deltaTimeSeconds!);
        }
    }





}
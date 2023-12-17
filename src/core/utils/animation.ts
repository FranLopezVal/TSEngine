import { vector2 } from "../math/v2";

export class Animation
{
    private _key: string = '';
    private _frames: 
    {
        timeExecution: number,
        position: vector2
    }[] = [];
    private _animationSpeed: number = 1;
    private _animationLength: number = 0;
    private _animationLoop: boolean = true;
    private _animationFinished: boolean = false;

    constructor(key:string, keyFrames: {timeExecution: number, position: vector2}[], animationSpeed: number = 1, animationLoop: boolean = true)
    {
        this._key = key;
        this._frames = keyFrames;
        this._animationSpeed = animationSpeed;
        this._animationLoop = animationLoop;

        this._animationLength = this._frames[this._frames.length-1].timeExecution;
    }

    get key()
    {
        return this._key;
    }

    get animationFinished()
    {
        return this._animationFinished;
    }

    get animationLength()
    {
        return this._animationLength;
    }

    get animationSpeed()
    {
        return this._animationSpeed;
    }

    get animationLoop()
    {
        return this._animationLoop;
    }

    get keyFrames()
    {
        return this._frames;
    }

    set animationFinished(finished: boolean)
    {
        this._animationFinished = finished;
    }

    getFrame(index: number)
    {
        return this._frames[index];
    }
}
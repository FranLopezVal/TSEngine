import {Scene} from "../scene";
import { Input } from "./Input";
import Render from "./engineRender";

export class Engine {

  public static DEBUG: boolean = true;
  public static RelationPixel: number = 64; //todo: fail if not 64

  private _renderer: Render | null = null;
  
  private static _instance: Engine;
  private constructor() {
    if(Engine._instance){
      throw new Error("Error: Instantiation failed: Use Engine.getInstance() instead of new.");
    }
    Engine._instance = this;
  }
  public static getInstance(): Engine
  {
    if(!Engine._instance)
    {
      Engine._instance = new Engine();
    }
    return Engine._instance;
  }


  get renderer() {
    return this._renderer;
  }

  get deltaTime() {
    return this._renderer?.deltaTime;
  }

  get deltaTimeSeconds() {
    return this._renderer?.deltaTimeSeconds;
  }

  get totalTime() {
    return this._renderer?.lastTime;
  }

  Init(scene: Scene) {
    Input.Init();
    this._renderer = new Render();
    this._renderer.scene = scene;
    this._renderer.Init();
  }

  Run() {
    this._renderer?.Update();
  }
}
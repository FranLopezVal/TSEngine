import { Camera } from "../components/camera";
import { Collider } from "../components/collider";
import { Light, LightShape } from "../components/light";
import { Rigidbody } from "../components/rigidbody";
import { Sprite } from "../components/sprite";
import { vector2 } from "../math/v2";
import { PhysicsManager } from "../physics/physicsManagers";
import { Scene } from "../scene";
import { Input } from "./Input";
import { Engine } from "./engine";

export default class Render {
    private _canvas: HTMLCanvasElement;
    
    private _lastTime = 0
    private _deltaTime = 0
    private _deltaTimeSeconds = 0
    
    private allRigids = Array<Rigidbody>();
    private _allColliders = Array<Collider>();
    private _allLights = Array<Light>();

    public pauseGame: boolean = false;

    private currentScene: Scene | null = null;
    _mousePosition: { x: number, y: number } = { x: 0, y: 0 };
    
    RenderType: 'PIXEL' | 'RELATION' | 'MID_RELATION' | 'QUART_RELATION' | string = 'PIXEL';

    constructor() {
        this._canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;
        if (!this._canvas) {
            console.error('Unable to find canvas element');
            return;
        }
        this._canvas.addEventListener('mousemove', (event) => {
            this._mousePosition = this.MousePosition(this._canvas, event);
        });

    }

    get allColliders() {
        return this._allColliders;
    }
    get allLights() {
        return this._allLights;
    }
    get lastTime() {
        return this._lastTime;
    }
    
    get deltaTime() {
        return this._deltaTime;
    }

    get deltaTimeSeconds() {
        return this._deltaTimeSeconds;
    }    

    set scene(scene: Scene | null) {
        this.currentScene = scene;
    }
    get scene() {
        return this.currentScene;
    }

    get width() {
        return this._canvas.width;
    }
    get height() {
        return this._canvas.height;
    }

    Init() {
        if (this.currentScene) {
            this.currentScene._objects.forEach((obj) => {
                obj.OnLoad();
            });
        }
        if (this.currentScene) {
            this.currentScene.objects.forEach((obj) => {
                obj.getComponents().forEach((comp) => {
                    if (comp instanceof Rigidbody) {
                        this.allRigids.push(comp);
                    }
                    if (comp instanceof Collider) {
                        this._allColliders.push(comp);
                    }
                    if (comp instanceof Light) {
                        this._allLights.push(comp);
                    }
                });
            });
        }
    }  

    RenderCollidersBounds() {
        this._allColliders.forEach((collider) => {
            this.drawBorderedRect(collider.bounds.left, collider.bounds.top, collider.bounds.width, collider.bounds.height, '#f0f5');
        });
    }

    RenderLightsCenter() {
        this._allLights.forEach((light) => {
            this.drawCross(light.centerOfLight().x, light.centerOfLight().y, 15, 15, '#a0a',5);
        });
    }

    RenderScale(size: vector2)
    {
        this.getContext()?.setTransform(size.x, 0, 0, size.y, 0, 0);
    }

    async SimulatePhysics() {
        PhysicsManager.Instance.SimulatePhysics(this._allColliders);
    }

    Update() {
        if(this.pauseGame) return;
        
        const currentTime = performance.now()

        this._deltaTime = currentTime - this._lastTime
        this._deltaTimeSeconds = this._deltaTime / 1000
        this._lastTime = currentTime

        this.SimulatePhysics();

        if (this.currentScene) {
            this.currentScene.Update();
        }
        var vWidth = Math.min(this.scene?.size.x!, this._canvas.width);
        var vHeight = Math.min(this.scene?.size.x! , this._canvas.height);

        Camera.mainCamera?.OnCameraUpdate(Camera.mainCamera.targetFollow, 0, 0);
        this._canvas.style.backgroundColor = Camera.mainCamera?.backgroundColor!;
        
        this.clear();
        this.RenderSprites();

        if (Engine.DEBUG) {
            this.RenderLightsCenter();
            this.RenderCollidersBounds();

            const fps = 1 / this._deltaTimeSeconds;
            this.drawRect(10, 10, 200, 70, '#fff5');
            this.drawDebug(`Mouse position: X-${Input.MousePosition!.x} Y-${Input.MousePosition!.y}`, 20, 20, 'black');
            this.drawDebug(`Relative position: X-${Input.RelativeMousePosition!.x} Y-${Input.RelativeMousePosition!.y}`, 20, 30, 'red');
            this.drawDebug(`Relation position: X-${Input.PixelMousePosition!.x} Y-${Input.PixelMousePosition!.y}`, 20, 40, 'darkgreen');
            this.drawDebug(`FPS:${ ~~fps }`, 20, 50, 'darkgreen');
            this.drawDebug(`Delta Seconds:${this._deltaTimeSeconds.toFixed(4)}`, 20, 60, 'darkgreen');
            this.drawDebug(`Total delta:${this._lastTime.toFixed(4)}`, 20, 70, 'darkgreen');
        }
        this.RenderLights();

        window.requestAnimationFrame(() => this.Update());
    }

    private MousePosition(canvas: HTMLCanvasElement, event: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }

    RenderLights() {
        if (this.currentScene) {
            this.currentScene.objects.forEach((obj) => {
                obj.getComponents().forEach((comp) => {
                    
                });
            });
        }
    }

    RenderSprites() {
        if (this.currentScene) {
            this.currentScene.objects.sort((a, b) => {
                if (a.id < b.id ) {
                    return 1;
                  }
                  if (a.id  > b.id ) {
                    return -1;
                  }
                  return 0;
            })
            .forEach((obj) => {
                obj.getComponents().forEach((comp) => {
                    if (comp instanceof Sprite) {
                        if (!comp.Image || !comp.Loaded) {
                            return;
                        }

                        let x = obj.transform?.position.x!; 
                        let y = obj.transform?.position.y!;
                        
                        switch (this.RenderType) {
                            case 'PIXEL':
                                break;
                            case 'RELATION':
                                x = ~~(x! / Engine.RelationPixel) * Engine.RelationPixel;
                                y = ~~(y! / Engine.RelationPixel) * Engine.RelationPixel;
                                break;
                            case 'MID_RELATION':
                                x = ~~(x! / (Engine.RelationPixel/2)) * (Engine.RelationPixel/2);
                                y = ~~(y! / (Engine.RelationPixel/2)) * (Engine.RelationPixel/2);
                                break;
                            case 'QUART_RELATION':
                                x = ~~(x! / (Engine.RelationPixel/4)) * (Engine.RelationPixel/4);
                                y = ~~(y! / (Engine.RelationPixel/4)) * (Engine.RelationPixel/4);
                                break;
                            default:
                                break;
                        }

                        this.drawImageSection(comp, x!, y!, comp.drawOnBack);
                    }
                    if (comp instanceof Light)
                    {
                        const l = comp as Light;
                        let x = obj.transform?.position.x!; 
                        let y = obj.transform?.position.y!;
                        
                        switch (this.RenderType) {
                            case 'PIXEL':
                                break;
                            case 'RELATION':
                                x = ~~(x! / Engine.RelationPixel) * Engine.RelationPixel;
                                y = ~~(y! / Engine.RelationPixel) * Engine.RelationPixel;
                                break;
                            case 'MID_RELATION':
                                x = ~~(x! / (Engine.RelationPixel/2)) * (Engine.RelationPixel/2);
                                y = ~~(y! / (Engine.RelationPixel/2)) * (Engine.RelationPixel/2);
                                break;
                            case 'QUART_RELATION':
                                x = ~~(x! / (Engine.RelationPixel/4)) * (Engine.RelationPixel/4);
                                y = ~~(y! / (Engine.RelationPixel/4)) * (Engine.RelationPixel/4);
                                break;
                            default:
                                break;
                        }
                        l.simulateShadows();
                        this.drawGradient(x!, y!, l.radius, l.color, l.intensity, l.shape);
                    }
                });
            });
        }
    }

    getCanvas() {
        return this._canvas;
    }
    getContext() {
        return this._canvas.getContext('2d');
    }

    clear() {
        const ctx = this.getContext();
        if (ctx) {
            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }
    drawRect(x: number, y: number, width: number, height: number, color: string) {
        const ctx = this.getContext();
        if (ctx) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
            ctx.restore();
        }
    }

    drawCross(x: number, y: number, width: number, height: number, color: string, lineWidth: number = 4) {
        
        const ctx = this.getContext();
        if (ctx) {
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(x - width / 2, y);
            ctx.lineTo(x + width / 2, y);
            ctx.moveTo(x, y - height / 2);
            ctx.lineTo(x, y + height / 2);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.restore();
        }
    }

    drawBorderedRect(x: number, y: number, width: number, height: number, color: string) {
        const ctx = this.getContext();
        if (ctx) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(x, y, width, height);
        }
    }

    drawCircle(x: number, y: number, radius: number, color: string) {
        const ctx = this.getContext();
        if (ctx) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    drawGradient(x: number, y: number, radius: number, color: string = 'ffff99'
        , intensity:number=1, shape: LightShape = LightShape.circle) {
        const ctx = this.getContext();
        if (ctx) {
            ctx.globalCompositeOperation = 'lighter';
            var grd = ctx.createRadialGradient(x, y, radius * intensity, x, y, radius);
            grd.addColorStop(0,rgba(color, intensity));
            grd.addColorStop(1, 'transparent'); //color + '00'
            ctx.fillStyle = grd;
            ctx.beginPath();
            switch (shape) {
                case LightShape.circle:
                    ctx.arc(x, y, radius, 0, 2 * Math.PI);
                    break;
                case LightShape.square:
                    ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
                    break;
                case LightShape.horizontal:
                    ctx.rect(x - radius, y - radius / 2, radius * 2, radius);
                    break;
                case LightShape.vertical:
                    ctx.rect(x - radius / 2, y - radius, radius, radius * 2);
                    break;
                default:
                    break;
            }
            ctx.fill();
            ctx.restore();
        }
    }

    drawText(text: string, x: number, y: number, color: string) {
        const ctx = this.getContext();
        if (ctx) {
            ctx.fillStyle = color;
            ctx.font = '20px Arial';
            ctx.fillText(text, x, y);
        }
    }
    drawDebug(text: string, x: number, y: number, color: string) {
        const ctx = this.getContext();
        if (ctx) {
            ctx.fillStyle = color;
            ctx.font = '10px Arial';
            ctx.fillText(text, x, y);
        }
    }

    drawImage(img: Sprite, x: number, y: number) {
        const ctx = this.getContext();
        if (ctx) {
            ctx.drawImage(img.Image!, x, y, img.Image?.width!, img.Image?.height!);
        }
    }

    drawImageSection(img: Sprite, x: number, y: number, drawOnBack: boolean = false) {
        const ctx = this.getContext();
        const dx = img.currentFrame.x * img.Image?.height!;
        const dy = img.currentFrame.y * img.Image?.height!;
        ctx?.restore();
        img.Image!.className = 'sblock';
            ctx!.globalCompositeOperation! = 'source-over';
        
        const sizex = img.Size * Engine.RelationPixel;
        const sizey = img.Size * Engine.RelationPixel;
        if (ctx) {
            ctx.drawImage(img.Image!, dx, dy, img.Image?.width! / img.Size, img.Image?.height! / img.Size, x, y, sizex, sizey);
        }

    }
}


function rgba(color: string, intensity: number): string {
    return `rgba(${parseInt(color.substr(0, 2), 16)},${parseInt(color.substr(2, 2), 16)},${parseInt(color.substr(4, 2), 16)},${intensity})`;
}
/**if  (shape == 'circle') {
            const ctx = this.getContext();
            if (ctx) {
                var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
            }
        } else if (shape == 'square') {
            const ctx = this.getContext();
            if (ctx) {
                var gradient = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
            }
        } else if (shape == 'horizontal') {
            const ctx = this.getContext();
            if (ctx) {
                var gradient = ctx.createLinearGradient(x - radius, y, x + radius, y);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
            }
        } else if (shape == 'vertical') {
            const ctx = this.getContext();
            if (ctx) {
                var gradient = ctx.createLinearGradient(x, y - radius, x, y + radius);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
            }
        } */
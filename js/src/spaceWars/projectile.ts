import Vector2D from '../system/drawing/vector2d';
import Color from '../system/drawing/color';
import Circle from '../system/drawing/circle';

import {IProjectile} from '../system/simulation/projectile/projectileSystem';

export default class Projectile implements IProjectile
{
    private _circle:Circle;
    public damage:number = 100;
    
    private _radius:number = 2;
    public get radius():number
    {
        return this._radius;
    }
    public set radius(value:number)
    {
        this._radius = value;
        this._update();
    }

    private _position:Vector2D;
    public get position():Vector2D
    {
        return this._position;
    }
    public set position(value:Vector2D)
    {
        if (this._position != null)
        {
            this._position.onChanged.unsubscribe(this.positionOnChanged);
        }

        this._position = value;
        this._position.onChanged.subscribe(this.positionOnChanged);
        this._update();
    }   
    
    private _velocity:Vector2D;
    public get velocity():Vector2D
    {
        return this._velocity;
    }
    public set velocity(value:Vector2D)
    {
        this._velocity = value;
        this._update();
    }    
    
    private _fillStyle:Color = Color.white;
    public get fillStyle():Color
    {
        return this._fillStyle;
    }
    public set fillStyle(value:Color)
    {
        this._fillStyle = value;
        this._update();
    }   
    
    private _strokeStyle:Color = Color.white;
    public get strokeStyle():Color
    {
        return this._strokeStyle;
    }
    public set strokeStyle(value:Color)
    {
        this._strokeStyle = value;
        this._update();
    }

    constructor(x:number, y:number)
    {
        this._circle = new Circle(x, y, this.radius, this.fillStyle, this.strokeStyle);
        this.position = new Vector2D(x, y);
    }

    protected positionOnChanged = (sender:any):void =>
    {
        this._update();
    }

    public render(ctx:CanvasRenderingContext2D):void
    {
        this._circle.render(ctx);
    }

    private _update():void
    {
        this._circle.position.set(this._position);
        this._circle.radius = this._radius;
        this._circle.fillStyle = this._fillStyle;
        this._circle.strokeStyle = this._strokeStyle;
    }
}
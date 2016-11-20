import {BaseRenderable, IRotatable} from './baseRenderable';
import Vector2D from '../component/vector2d';
import Polygon from './polygon';
import Size from '../component/size';
import Color from '../component/color';

export default class Star extends BaseRenderable implements IRotatable
{
    private _pointCount:number;
    private _innerRadius:number;
    private _outerRadius:number;

    private _rotation:number = 0;

    public noUpdate:boolean = false;

    public get rotation():number
    {
        return this._rotation;
    }

    public set rotation(value:number)
    {
        this._rotation = value;
        this.update();
    }
    
    private _vertices:Vector2D[];

    public get pointCount():number { return this._pointCount; }

    public set pointCount(value:number)
    {
        this._pointCount = value;
        this.update();
    }    
    
    public get innerRadius():number { return this._innerRadius; }

    public set innerRadius(value:number)
    {
        this._innerRadius = value;
        this.update();
    }    

    public get outerRadius():number { return this._outerRadius; }

    public set outerRadius(value:number)
    {
        this._outerRadius = value;
        this.update();
    }

    constructor(x:number = 0, y:number = 0, pointCount:number = 0, innerRadius:number = 0, outerRadius:number = 0, fillStyle:Color = Color.black, strokeStyle:Color = Color.white)
    {
        super(x, y, fillStyle, strokeStyle);

        this._pointCount = pointCount;
        this._innerRadius = innerRadius;
        this._outerRadius = outerRadius;

        this._vertices = [];

        this.update();
    }

    protected positionOnChanged = (sender:Vector2D):void =>
    {
        this.update();
    }

    public update():void
    {
        if (this.noUpdate)
        {
            return;
        }
        
        this._vertices = [];

        var step = Math.PI * 2 / (this.pointCount * 2);

        var even = true;

        for(var i = -Math.PI; i <= Math.PI; i += step)
        {
            var radius = even ? this._outerRadius : this._innerRadius;
            var pos = new Vector2D(this.position.x + radius * Math.cos(i + this._rotation), this.position.y + radius * Math.sin(i + this._rotation));
            this._vertices.push(pos);

            even = !even;
        }
    }

    public render(ctx:CanvasRenderingContext2D):void
    {
        this.beginRender(ctx);

        Polygon.renderVertices(ctx, this._vertices);

        this.endRender(ctx);
    }

    public intersects(position:Vector2D):boolean
    {
        return Polygon.intersects(this._vertices, position);
    }
}

import {Renderable, IRenderable} from './renderable';
import Vector2D from './vector2d';
import Polygon from './polygon';
import Size from './size';
import Color from './color';

export default class Star extends Renderable implements IRenderable
{
    private _pointCount:number;
    private _innerRadius:number;
    private _outerRadius:number;
    
    private _vertices:Vector2D[];

    public get pointCount():number { return this._pointCount; }

    public set pointCount(value:number)
    {
        this._pointCount = value;
        this._update();
    }    
    
    public get innerRadius():number { return this._innerRadius; }

    public set innerRadius(value:number)
    {
        this._innerRadius = value;
        this._update();
    }    

    public get outerRadius():number { return this._outerRadius; }

    public set outerRadius(value:number)
    {
        this._outerRadius = value;
        this._update();
    }

    constructor(x:number = 0, y:number = 0, pointCount:number = 0, innerRadius:number = 0, outerRadius:number = 0, fillStyle:Color = Color.black, strokeStyle:Color = Color.white)
    {
        super(x, y, fillStyle, strokeStyle);

        this._pointCount = pointCount;
        this._innerRadius = innerRadius;
        this._outerRadius = outerRadius;

        this._vertices = [];

        this._update();
    }

    protected positionOnChanged = (sender:Vector2D):void =>
    {
        this._update();
    }

    private _update():void
    {
        this._vertices = [];

        var step = Math.PI * 2 / (this.pointCount * 2);

        var even = true;

        for(var i = -Math.PI; i <= Math.PI; i += step)
        {
            var radius = even ? this._outerRadius : this._innerRadius;
            var pos = new Vector2D(this.position.x + radius * Math.cos(i), this.position.y + radius * Math.sin(i));
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

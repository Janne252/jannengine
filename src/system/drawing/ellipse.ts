import {Renderable, IRenderable} from './renderable';
import Vector2D from './vector2d';
import Size from './size';
import Color from './color';

export default class Ellipse extends Renderable implements IRenderable
{
    public size:Size = new Size(0, 0);
    public startAngle:number = 0;
    public endAngle:number = Math.PI * 2;
    public anticlockwise:boolean = false;

    public get xRadius():number
    {
        return this.size.width;
    }    
    
    public get yRadius():number
    {
        return this.size.height;
    }

    public set xRadius(value:number)
    {
       this.size.width = value;
    }    
    
    public set yRadius(value:number)
    {
        this.size.height = value;
    }

    constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0, fillStyle:Color = Color.black, strokeStyle:Color = Color.white)
    {
        super(x, y, fillStyle, strokeStyle);

        this.size.width = width;
        this.size.height = height;
    }

    public render(ctx:CanvasRenderingContext2D):void
    {
        this.beginRender(ctx);

        ctx.ellipse(this.position.x, this.position.y, this.xRadius, this.yRadius, 0, this.startAngle, this.endAngle, this.anticlockwise);
        
        this.endRender(ctx);
    }

    /**
     * Checks if a position is in the ellipse. Does not support "unfull" ellipses (endAngle - startAngle != Math.PI * 2)
     * @param position The position to check.
     * Returns true if the position is inside the ellipse.
     */
    public intersects(position:Vector2D):boolean
    {
        var normalized = new Vector2D(position.x - this.position.x, position.y - this.position.y);

        return ((normalized.x * normalized.x) / (this.xRadius * this.xRadius)) + ((normalized.y * normalized.y) / (this.yRadius * this.yRadius)) <= 1.0;
    }
}

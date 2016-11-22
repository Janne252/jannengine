import {BaseRenderable} from './renderable/baseRenderable';
import Vector2D from '../component/vector2d';
import Size from '../component/size';
import Color from '../component/color';

/**
 * Represents an ellipse.
 */
export default class Ellipse extends BaseRenderable
{
    /**
     * The horizontal/x (width) and the vertical/y (height) radius of the ellipse.
     */
    public size:Size = new Size(0, 0);
    /**
     * Angle to start drawing the ellipse.
     */
    public startAngle:number = 0;
    /**
     * Angle to end drawing the ellipse.
     */
    public endAngle:number = Math.PI * 2;
    /**
     * Whether or not the ellipse should be drawn anti-clockwise.
     */
    public anticlockwise:boolean = false;
    /**
     * The x-axis radius.
     */
    public get xRadius():number
    {
        return this.size.width;
    }    
    /**
     * The x-axis radius.
     */
    public set xRadius(value:number)
    {
       this.size.width = value;
    }   
    /**
     * The y-axis radius.
     */
    public get yRadius():number
    {
        return this.size.height;
    }
    /**
     * The y-axis radius.
     */
    public set yRadius(value:number)
    {
        this.size.height = value;
    }
    /**
     * Creates a new instance of Ellipse.
     * @param x The x component of the position vector.
     * @param y The y component of the position vector.
     * @param width the x-axis radius.
     * @param height the y-axis radius.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     */
    constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0, fillStyle:Color = Color.black, strokeStyle:Color = Color.white)
    {
        super(x, y, fillStyle, strokeStyle);

        this.size.width = width;
        this.size.height = height;
    }
    /**
     * Renders the Ellipse.
     * @param ctx CanvasRenderingContext2D used to render.
     */
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

import {BaseRenderable} from './renderable/baseRenderable';
import Vector2D from '../component/vector2d';
import Size from '../component/size';
import Color from '../component/color';

/**
 * Represents a circle.
 */
export default class Circle extends BaseRenderable
{
    /**
     * The radius of the circle.
     */
    public radius:number = 0;
    /**
     * Creates a new instance of Circle.
     * @param x The x component of the position vector.
     * @param y The y component of the position vector.
     * @param radius The radius of the cirlcle.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     */
    constructor(x:number = 0, y:number = 0, radius:number = 0, fillStyle:Color = Color.black, strokeStyle:Color = Color.white)
    {
        super(x, y, fillStyle, strokeStyle);

        this.radius = radius;
    }
    /**
     * Renders the Circle.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    public render(ctx:CanvasRenderingContext2D):void
    {
        this.beginRender(ctx);

        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        
        this.endRender(ctx);
    }
    /**
     * Inspects if a position is inside of a Circle.
     * @param position The position to check against.
     * Returns true if the position is inside the Circle.
     */
    public intersects(position:Vector2D):boolean
    {
        //(x-center_x)^2 + (y - center_y)^2 < radius^2
        //(position.x - this.position.x)^2 + (position.y - this.position.y)^2 < this.radius^2

        let diff1 = position.x - this.position.x;
        let part1 = diff1 * diff1;

        let diff2 = position.y - this.position.y;
        let part2 = diff2 * diff2;
        
        let part3 = this.radius * this.radius;

        return part1 + part2 < part3;
    }
}

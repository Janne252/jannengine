import {BaseRenderable} from './renderable/baseRenderable';
import Vector2D from './../component/vector2d';
import Size from './../component/size';
import Color from './../component/color';
import Polygon from './polygon';

/**
 * Represents a 2-dimensional line.
 */
export default class Line extends BaseRenderable
{
    private _endPosition:Vector2D = new Vector2D(0, 0);
    private _vertices:Vector2D[] = [];

    /**
     * The end position of the line.
     */
    public get endPosition():Vector2D
    {
        return this._endPosition;
    }
    /**
     * The end position of the line.
     */
    public set endPosition(value:Vector2D)
    {
        this._endPosition.onChanged.unsubscribe(this.positionOnChanged);
        this._endPosition = value;
        this._endPosition.onChanged.subscribe(this.positionOnChanged);
        this.update();
    }
    /**
     * Creates a new instance of Line.
     * @param x The x component of the position vector.
     * @param y The y component of the position vector.
     * @param endX The x component of the end position vector.
     * @param endY The y component of the end position vector.
     * @param lineWidth The width of the line.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     */
    constructor(x:number = 0, y:number = 0, endX:number = 0, endY:number = 0, lineWidth:number = 0, strokeStyle:Color = Color.white)
    {
        super(x, y, null, strokeStyle);
        this.closePath = false;

        this.fill = false;
        this.lineWidth = lineWidth;

        this._endPosition.x = endX;
        this._endPosition.y = endY;

        this._endPosition.onChanged.subscribe(this.positionOnChanged);

        this.update();
    }
    /**
     * Reacts to changes in position.
     */
    protected positionOnChanged = (sender:Vector2D):void =>
    {
        this.update();
    }
    /**
     * Updates the internal properties of the line.
     */
    public update():void
    {
        var quarterTurn = Math.PI / 2;

        var angle = this.position.getAngleTowardsVector(this._endPosition);
        
        var topLeft = this.position.getOffsetTowardsAngle(this.lineWidth / 2, angle - quarterTurn);
        var topRight = this._endPosition.getOffsetTowardsAngle(this.lineWidth / 2, angle - quarterTurn);

        var bottomRight = this._endPosition.getOffsetTowardsAngle(this.lineWidth / 2, angle + quarterTurn);
        var bottomLeft = this.position.getOffsetTowardsAngle(this.lineWidth / 2, angle + quarterTurn);

        this._vertices = [topLeft, topRight, bottomRight, bottomLeft];
    }
    /**
     * Renders the Line.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    public render(ctx:CanvasRenderingContext2D):void
    {
        this.beginRender(ctx);
       
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this._endPosition.x, this._endPosition.y);
        
        this.endRender(ctx);
    }
    /**
     * Inspects if a position is inside of a line.
     * @param position The position to check against.
     * Returns true if the position is inside the line.
     */
    public intersects(position:Vector2D):boolean
    {
        return Polygon.intersects(this._vertices, position);
    }
}

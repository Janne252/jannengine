import {Renderable, IRenderable} from './renderable';
import Vector2D from './vector2d';
import Size from './size';
import Color from './color';
import Polygon from './polygon';

export default class Line extends Renderable implements IRenderable
{
    private _endPosition:Vector2D = new Vector2D(0, 0);
    private _vertices:Vector2D[] = [];

    public get endPosition():Vector2D
    {
        return this._endPosition;
    }

    public set endPosition(value:Vector2D)
    {
        this._endPosition.onChanged.unsubscribe(this.positionOnChanged);
        this._endPosition = value;
        this._endPosition.onChanged.subscribe(this.positionOnChanged);
        this.update();
    }

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

    protected positionOnChanged = (sender:Vector2D):void =>
    {
        this.update();
    }

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

    public render(ctx:CanvasRenderingContext2D):void
    {
        this.beginRender(ctx);
       
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this._endPosition.x, this._endPosition.y);
        
        this.endRender(ctx);
    }

    public intersects(position:Vector2D):boolean
    {
        return Polygon.intersects(this._vertices, position);
    }

    private _test(ctx:CanvasRenderingContext2D):void
    {
        var quarterTurn = Math.PI / 2;

        var angle = this.position.getAngleTowardsVector(this._endPosition);
        
        var topLeft = this.position.getOffsetTowardsAngle(this.lineWidth / 2, angle - quarterTurn);
        var topRight = this._endPosition.getOffsetTowardsAngle(this.lineWidth / 2, angle - quarterTurn);

        var bottomRight = this._endPosition.getOffsetTowardsAngle(this.lineWidth / 2, angle + quarterTurn);
        var bottomLeft = this.position.getOffsetTowardsAngle(this.lineWidth / 2, angle + quarterTurn);

        ctx.beginPath();
        ctx.strokeStyle = Color.red.toString();
        ctx.lineWidth = 1;

        ctx.moveTo(topLeft.x, topLeft.y);
        ctx.lineTo(topRight.x, topRight.y);
        ctx.lineTo(bottomRight.x, bottomRight.y);
        ctx.lineTo(bottomLeft.x, bottomLeft.y);
        ctx.closePath();

        ctx.stroke();
    }
}


import {Renderable, IRenderable, IRotatable} from './renderable';
import Vector2D from './vector2d';
import Polygon from './polygon';
import Color from './color';

/**
 * Respresents a symmetrical polygon (triangle, square, pentagon, hexacon, heptagon, octagon, etc.).
 */
export default class RegularPolygon extends Renderable implements IRenderable, IRotatable
{
    private _rotation:number = 0;
    private _radius:number = 0;
    private _vertexCount:number = 0;
    private _vertices:Vector2D[] = [];

    public noUpdate:boolean = false;
    /**
     * The number of vertices (points) of the RegularPolygon.
     */
    public get vertexCount():number
    {
        return this._vertexCount;
    }
    /**
     * The number of vertices (points) of the RegularPolygon.
     */
    public set vertexCount(value:number)
    {
        this._vertexCount = value;
        this.update();
    }
    /**
     * The radius of the RegularPolygon.
     */
    public get radius():number
    {
        return this._radius;
    }
    /**
     * The radius of the RegularPolygon.
     */
    public set radius(value:number)
    {
        this._radius = value;
        this.update();
    }    
    /**
     * The rotation of the RegularPolygon.
     */
    public get rotation():number
    {
        return this._rotation;
    }
    /**
     * The rotation of the RegularPolygon.
     */
    public set rotation(value:number)
    {
        this._rotation = value;
        this.update();
    }

    /**
     * Creates a new instance of RegularPolygon.
     * @param x The x coordinate.
     * @param y The y coordinate.
     * @param radius The radius.
     * @param vertexCount The number of vertices.
     * @param fillStyle The fillstyle.
     * @param strokeStyle The strokeStyle.
     */
    constructor(x:number = 0, y:number = 0, radius:number = 0, vertexCount:number = 0, fillStyle:Color = Color.black, strokeStyle:Color = Color.white)
    {
        super(x, y, fillStyle, strokeStyle);

        this.radius = radius;
        this._vertexCount = vertexCount;

        this.update();
    }

    /**
     * Reacts to the changes of the position property.
     */
    protected positionOnChanged = (sender:Vector2D):void =>
    {
        this.update();
    }

    /**
     * Re-calculates the RegularPolygon positions based on its position, radius, vertexCount, and rotation.
     */
    public update():void
    {
        if (this.noUpdate)
        {
            return;
        }
        
        this._vertices = [];

        var step = Math.PI * 2 / this._vertexCount;

        for(var i = -Math.PI; i <= Math.PI; i += step)
        {
            var pos = new Vector2D(this.position.x + this.radius * Math.cos(i + this._rotation), this.position.y + this.radius * Math.sin(i + this._rotation));
            this._vertices.push(pos);
        }
    }

    /**
     * Renders the RegularPolygon.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    public render(ctx:CanvasRenderingContext2D):void
    {
        this.beginRender(ctx);

        Polygon.renderVertices(ctx, this._vertices);
        
        this.endRender(ctx);
    }

    /**
     * Inspects if a position is inside the regular polygon.
     * @param position The position to check against.
     * @returns Returns true if the position is inside the RegularPolygon.
     */
    public intersects(position:Vector2D):boolean
    {
        return Polygon.intersects(this._vertices, position);
    }
}

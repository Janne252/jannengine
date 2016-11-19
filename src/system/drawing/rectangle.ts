import {Renderable, IRenderable, IRotatable} from './renderable';
import Random from '../random';
import Vector2D from './vector2d';
import Size from './size';
import Color from './color';
import Polygon from './polygon';
import IPadding from './padding';
import {hypot, normalizeRadians, degrees} from '../helpers/math';

/**
 * Represents a standard rectangle that has a position, width, and height. Can be rotated.
 */
export default class Rectangle extends Renderable implements IRenderable, IRotatable
{
    private _size:Size = new Size(0, 0);
    private _rotation:number = 0;
    private _vertices:Vector2D[] = [];

    /**
     * Origin of the Rectangle used to render it.
     */
    public origin:RectangleOrigin = RectangleOrigin.Center; 
    /**
     * Wheter the internal updating of the object is paused.
     */
    public noUpdate:boolean = false;
    /**
     * The rotation of the object in radians.
     */
    public get rotation():number
    {
        return this._rotation;
    }
    /**
     * The rotation of the object in radians.
     */
    public set rotation(value:number)
    {
        this._rotation = value;
        this.update();
    }
    /**
     * The size of the Rectangle.
     */
    public get size():Size
    {
        return this._size;
    }
    /**
     * The size of the Rectangle.
     */
    public set size(value:Size)
    {
        if (this._size !== undefined)
        {
            this._size.onChanged.unsubscribe(this.sizeOnChanged);
        }

        this._size = value;
        this.update();
        this._size.onChanged.subscribe(this.sizeOnChanged);
    }
    /**
     * The width of the Rectangle. (Quick access to Rectangle.size.width)
     */
    public get width():number
    {
        return this._size.width;
    }
    /**
     * The width of the Rectangle. (Quick access to Rectangle.size.width)
     */
    public set width(value:number)
    {
        this.size.width = value;
    }
    /**
     * The height of the Rectangle. (Quick access to Rectangle.size.height)
     */
    public get height():number
    {
        return this.size.height;
    }
    /**
     * The height of the Rectangle. (Quick access to Rectangle.size.height)
     */
    public set height(value:number)
    {
        this.size.height = value;
    }
    /**
     * Creates a new instance of Rectangle.
     * @param x The x component of the position vector.
     * @param y The y component of the position vector.
     * @param width The width of the Rectangle.
     * @param height The height of the Rectangle.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     */
    constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0, fillStyle:Color = Color.black, strokeStyle:Color = Color.white)
    {
        super(x, y, fillStyle, strokeStyle);

        this._size.width = width;
        this._size.height = height;

        this.update();
        this._size.onChanged.subscribe(this.sizeOnChanged);
    }

    /**
     * Reacts to Rectangle.size changes.
     * @param sender The sender of the event.
     */
    protected sizeOnChanged = (sender:Size):void =>
    {
        this.update();
    }

    /**
     * Re-calculates the Rectangle vertices.
     */
    public update():void
    {
        if (this.noUpdate)
        {
            return;
        }

        let width = this._size.width;
        let height = this._size.height;

        let _width = width / 2;
        let _height = height / 2;

        let _180Degrees = Math.PI;
        let _90Degrees = _180Degrees / 2;
        let _45Degrees = _90Degrees / 2;

        let rotation = this._rotation;
        let topLeft:Vector2D;
        let topRight:Vector2D;
        let bottomRight:Vector2D;
        let bottomLeft:Vector2D;

        switch(this.origin)
        {
            case RectangleOrigin.Center:
                let topRotation = normalizeRadians(rotation - _90Degrees);
                topLeft = this._position.getOffsetTowardsAngle(-_width, rotation).getOffsetTowardsAngle(_height, topRotation);
                topRight = this._position.getOffsetTowardsAngle(_width, rotation).getOffsetTowardsAngle(_height, topRotation);

                let bottomRotation = normalizeRadians(rotation + _90Degrees);
                bottomRight = topRight.getOffsetTowardsAngle(height, bottomRotation);
                bottomLeft = topLeft.getOffsetTowardsAngle(height, bottomRotation);

                break;
            case RectangleOrigin.TopLeft:
                topLeft = this._position;
                topRight = topLeft.getOffsetTowardsAngle(width, rotation);
                bottomRight = topRight.getOffsetTowardsAngle(height, rotation + _90Degrees);
                bottomLeft = topLeft.getOffsetTowardsAngle(height, rotation + _90Degrees);
                break;
        }

        this._vertices = [topLeft, topRight, bottomRight, bottomLeft];
    }

    /**
     * Renders the Rectangle.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    public render(ctx:CanvasRenderingContext2D):void
    {
        this.beginRender(ctx);

        Polygon.renderVertices(ctx, this._vertices);
        
        this.endRender(ctx);
    }

    /**
     * Checks if a position is inside of the Rectangle.
     * @param vector The position to check.
     * Returns true if the position is inside the Rectangle.
     */    
    public intersects(vector:Vector2D):boolean
    {
        return Polygon.intersects(this._vertices, vector);
    }

    /**
     * Returns a random position inside the rectangle. Does not take rotation into account.
     * @param padding Padding used to prevent results near the edges.
     * Returns the result position vector.
     */
    public getRandomPosition(padding?:IPadding):Vector2D
    {
        return Polygon.getRandomPosition(this._vertices, padding);
    }

    /**
     * Converts the Rectangle to a string representation, e.g. ([0, 0], [100, 0], [100, 100], [0, 100])
     * Returns the string.
     */
    public toString():string
    {
        return '(' + this._vertices.join(', ') + ')';
    }
}

export enum RectangleOrigin
{
    Center,
    TopLeft
}
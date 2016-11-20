/// <reference path="../component/vector2d.ts" />
/// <reference path="../component/color.ts" />
/// <reference path="./line/line.ts" />

import Vector2D from '../component/vector2d';
import Color from '../component/color';
import {LineCap, LineJoin} from './line/line';


/**
 * Implementation of Renderable that is NOT rotated by rotating the canvas context.
 */
export interface IRotatable
{
    /**
     * The rotation of the object in radians.
     */
    rotation:number;
    /**
     * Wheter the internal updating of the object is paused.
     */
    noUpdate:boolean;
    /**
     * Re-calculates the internal properites.
     */
    update():void;
}


/**
 * Minimum implementation of a Renderable object.
 */
export interface IRenderable
{
    /**
     * Renders the object.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    render(ctx:CanvasRenderingContext2D):void;
    /**
     * Checks if a position is inside of the object.
     * @param vector The position to check.
     * Returns true if the position is inside the object.
     */
    intersects(position:Vector2D):boolean;
}

/**
 * Represents a renderable object.
 */
export abstract class BaseRenderable implements IRenderable
{
    protected _position:Vector2D = new Vector2D(0, 0);

    /**
     * Used as CanvasRenderingContext2D.lineCap.
     */
    public lineCap:string = LineCap.butt;
    /**
     * Used as CanvasRenderingContext2D.lineJoin.
     */
    public lineJoin:string = LineJoin.miter;
    /**
     * Used as CanvasRenderingContext2D.miterLimit.
     */
    public miterLimit:number = 10;
    /**
     * Used as CanvasRenderingContext2D.miterLimit.
     */
    public lineDash:number[] = [];
    /**
     * Used as CanvasRenderingContext2D.setLineDash(lineDash). Example: [2, 16]
     */
    public lineDashOffset:number = 0;
    /**
     * Color used as the CanvasRenderingContext2D.fillStyle if fill is set to true.
     */
    public fillStyle = Color.black;
    /**
     * Color used as the CanvasRenderingContext2D.strokeStyle if stroke is set to true.
     */
    public strokeStyle = Color.white;
    /**
     * Used as CanvasRenderingContext2D.lineWidth.
     */
    public lineWidth:number = 1;
    /**
     * Whether or not the CanvasRenderingContext2D.fill() method should be called on endRender().
     */
    public fill:boolean = true;
    /**
     * Whether or not the CanvasRenderingContext2D.stroke() method should be called on endRender().
     */
    public stroke:boolean = true;
    /**
     * Whether or not CanvasRenderingContext2D.closePath() method should be called on endRender().
     */
    public closePath:boolean = true;
    /**
     * The position of the object.
     */
    public get position():Vector2D
    {
        return this._position;
    }
    /**
     * The position of the object.
     */
    public set position(value:Vector2D)
    {
        if (this._position != null)
        {
            this._position.onChanged.unsubscribe(this.positionOnChanged);
        }
        
        this._position = value;
        this._position.onChanged.subscribe(this.positionOnChanged);
        this.positionOnChanged(value);
    }
    /**
     * The x component of the position of the object.
     */
    public get x():number
    {
        return this._position.x;
    }
    /**
     * The x component of the position of the object.
     */
    public set x(value:number)
    {
        this._position.x = value;
    }
    /**
     * The y component of the position of the object.
     */
    public get y():number
    {
        return this._position.y;
    }
    /**
     * The y component of the position of the object.
     */
    public set y(value:number)
    {
        this._position.y = value;
    }
    /**
     * Creates a new instance of Renderable.
     * @param x The x component of the position.
     * @param y The y component of the position.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     */
    constructor(x:number, y:number, fillStyle:Color, strokeStyle:Color)
    {
        this._position.x = x;
        this._position.y = y;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        
        this._position.onChanged.subscribe(this.positionOnChanged);
    }

    /**
     * Defines how an object reacts to the change of the position property.
     * @param sender The position that initiated the event.
     */
    protected positionOnChanged = (sender:Vector2D):void => { }

    /**
     * Renders the object.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    public render(ctx:CanvasRenderingContext2D):void
    {
        throw new Error('Child class must implement method "render".');
    }
    
    /**
     * Intiates the rendering process by setting all the necessary properties.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    protected beginRender(ctx:CanvasRenderingContext2D):void
    {
        ctx.beginPath();

        ctx.lineCap = this.lineCap;
        ctx.lineJoin = this.lineJoin;
        ctx.miterLimit = this.miterLimit;
        
        ctx.setLineDash(this.lineDash);
        ctx.lineDashOffset = this.lineDashOffset;

        ctx.fillStyle = this.fillStyle != null ? this.fillStyle.toString() : null;
        ctx.strokeStyle = this.strokeStyle != null ? this.strokeStyle.toString() : null;

        ctx.lineWidth = this.lineWidth;
    }

    /**
     * Finalizes the rendering process.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    protected endRender(ctx:CanvasRenderingContext2D):void
    {
        if (this.closePath)
        {
            ctx.closePath();
        }
        
        if (this.fill)
        {
            ctx.fill();
        }

        if (this.stroke)
        {
            ctx.stroke();
        }
    }

    /**
     * Checks if a position is inside of the object.
     * @param vector The position to check.
     * Returns true if the position is inside the object.
     */
    public intersects(vector:Vector2D):boolean
    {
        throw new Error('Child class must implement method "intersects".');
    }
}
import Hitpoints from './../../engine/simulation/health/health';
import Size from '../../component/size';
import Vector2D from '../../component/vector2D';
import Color from '../../component/color';
import Rectangle, {RectangleOrigin} from '../../drawing/rectangle';
import {HealthBarElement, HealthBarBase, HealthBarProgress} from './healthBarElement';

/**
 * Represents a hitpoint display, i.e. |████   |
 * Designed to be update()'d every logic tick.
 */
export default class HealthBar implements IHealthBar
{
    private _size:Size = undefined;
    private _owner:IHealthBarOwner;
    private _offset:Vector2D = undefined;
    private _centerOffset:Vector2D = new Vector2D(0, 0);
    private _progressOffset:Vector2D = new Vector2D(0, 0);

    /**
     * Whether or not the HitpointBar is visible.
     */
    public visible:boolean = true;
    /**
     * Whether or not the HitPointBar should be horizontally centered relative to the owner's position.
     */
    public center:boolean = true;
    /**
     * The offset of the HitpointBar relative to the owner's position.
     */
    public get offset():Vector2D
    {
        return this._offset;
    }
    /**
     * The offset of the HitpointBar relative to the owner's position.
     */
    public set offset(value:Vector2D)
    {
        this._offset = value;
    }
    /**
     * The size (width and height) of the visual HitPointBar.
     */
    public get size():Size
    {
        return this._size;
    }
    /**
     * The size (width and height) of the visual HitPointBar.
     */
    public set size(value:Size)
    {
        this._size = value;
    }
    /**
     * The owner of the HitpointBar which is used to calculate the position of the HitPointBar.
     */
    public get owner():IHealthBarOwner
    {
        return this._owner;   
    }
    /**
     * The base (background) element of the HitpointBar.
     */
    public base:HealthBarElement;
    /**
     * The progress (foreground) element of the HitpointBar.
     */
    public progress:HealthBarElement;
    /**
     * Creates a new istance of HitpointBar.
     * @param width The width of the visual HitPointBar.
     * @param height The height of the visual HitPointBar.
     * @param owner The owner of the HitpointBar which is used to calculate the position of the HitPointBar.
     * @param offsetX The x-offset of the HitpointBar relative to its owner's position.
     * @param offsetY The y-offset of the HitpointBar relative to its owner's position.
     */
    constructor(width:number, height:number, owner:IHealthBarOwner, offsetX:number = 0, offsetY:number = -50)
    {
        this._size = new Size(width, height);
        this._offset = new Vector2D(offsetX, offsetY);
        this._owner = owner;

        this.base = new HealthBarBase(Color.white, Color.white, 1, this);
        this.progress = new HealthBarProgress(Color.black, Color.black, 0, this);
        this.base.transparency = 0.2;
        this.progress.transparency = 0.5;
    }
    /**
     * Returns the width of the progress element.
     */
    private getProgressWidth():number
    {
        let baseRect = this.base.rectangle;

        return (baseRect.width - (2 * baseRect.lineWidth)) * this.owner.hitpoints.percentage;
    }
    /**
     * Returns the height of the progress element.
     */
    private getProgressHeight():number
    {
        let baseRect = this.base.rectangle;

        return (baseRect.height - (2 * baseRect.lineWidth));
    }
    /**
     * Re-calucates all the positions and internal properties.
     */
    public update()
    {
        let baseRect = this.base.rectangle;

        this._progressOffset.x = baseRect.lineWidth;
        this._progressOffset.y = baseRect.lineWidth;
        this._centerOffset.x = -(this._size.width / 2);
       
        baseRect.width = this._size.width;
        baseRect.height = this._size.height;

        let progressRect = this.progress.rectangle;

        progressRect.height = this.getProgressHeight();
        progressRect.width = this.getProgressWidth();

        baseRect.position = this.owner.position.add(this._offset.add(this._centerOffset));
        progressRect.position = baseRect.position.add(this._progressOffset);

        this.base.update();
        this.progress.update();
    }
    /**
     * Renders the HitpointBar.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    public render(ctx:CanvasRenderingContext2D):void
    {
        if (this.visible)
        {
            this.base.render(ctx);
            this.progress.render(ctx);
        }
    }
}


/**
 * Minimum implementation of a Hitpoint bar.
 */
export interface IHealthBar
{
    /**
     * Owner of the HitpointBar.
     */
    owner:IHealthBarOwner;
    /**
     * Background of the HitpointBar.
    */   
    base:IHealthBarElement;
    /**
     * Foreground (actual progress indicator) of the HitpointBar.
    */   
    progress:IHealthBarElement;
    /**
     * The transparency of the HitpointBar (between 0.0 and 1.0)
     */
    center:boolean;
    /**
     * Whether or not the HitpointBar is visible.
     */
    visible:boolean;
}

/**
 * Minimum implementation of a Hitpoint bar's owner.
 */
export interface IHealthBarOwner
{
    /**
     * The position of the IHitpointBarOwner.
     */
    position:Vector2D;
    /**
     * The Hitpoints of the IHitpointBarOwner.
     */
    hitpoints:Hitpoints;
}

/**
 * Minimum implementation of a Hitpoint bar's element (base and progress).
 */
export interface IHealthBarElement
{
    /**
     * The transparency of the HitpointBar (between 0.0 and 1.0)
     */
    transparency:number;
    /**
     * The visible rectangle that is rendered.
     */
    rectangle:Rectangle;
    /**
     * Renders the HitpointBarElement.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    render(ctx:CanvasRenderingContext2D);
}

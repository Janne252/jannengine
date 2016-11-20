import Hitpoints from './hitpoints';
import Size from '../../../component/size';
import Vector2D from '../../../component/vector2D';
import Color from '../../../component/color';
import Rectangle, {RectangleOrigin} from '../../../drawing/rectangle';

/**
 * Represents a hitpoint display, i.e. |████   |
 */
export default class HitpointBar implements IHitpointBar
{
    private _size:Size = undefined;
    private _owner:IHitpointBarOwner;
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
        if (this._offset !== undefined)
        {
            this._offset.onChanged.unsubscribe(this.onOffsetChanged);
        }

        this._offset = value;
        this._offset.onChanged.subscribe(this.onOffsetChanged);
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
        if (this._size !== undefined)
        {
            this._size.onChanged.unsubscribe(this.sizeOnChanged);
        }

        this._size = value;
        this.update();
        this._size.onChanged.subscribe(this.sizeOnChanged);
    }
    /**
     * The owner of the HitpointBar which is used to calculate the position of the HitPointBar.
     */
    public get owner():IHitpointBarOwner
    {
        return this._owner;   
    }
    /**
     * The base (background) element of the HitpointBar.
     */
    public base:HitpointBarElement;
    /**
     * The progress (foreground) element of the HitpointBar.
     */
    public progress:HitpointBarElement;
    /**
     * Creates a new istance of HitpointBar.
     * @param width The width of the visual HitPointBar.
     * @param height The height of the visual HitPointBar.
     * @param owner The owner of the HitpointBar which is used to calculate the position of the HitPointBar.
     * @param offsetX The x-offset of the HitpointBar relative to its owner's position.
     * @param offsetY The y-offset of the HitpointBar relative to its owner's position.
     */
    constructor(width:number, height:number, owner:IHitpointBarOwner, offsetX:number = 0, offsetY:number = -50)
    {
        this._size = new Size(width, height);
        this._offset = new Vector2D(offsetX, offsetY);
        this._owner = owner;

        this.base = new HitpointBarBase(Color.white, Color.white, 1, this);
        this.progress = new HitpointBarProgress(Color.black, Color.black, 0, this);
        this.base.transparency = 0.2;
        this.progress.transparency = 0.5;
    }
    /**
     * Reacts to changes of the size property.
     */
    protected sizeOnChanged = (sender:Size):void => 
    {
        this.update();
    }
    /**
     * Reacts to changes of the offset property.
     */
    protected onOffsetChanged = (sender:Vector2D):void =>
    {
        this.update();
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
 * Represents abtract implementation of HitPointBar base and progress elements.
 */
export abstract class HitpointBarElement implements IHitpointBarElement
{
    private _transparency:number = 1.0;
    /**
     * The parent object.
     */
    private _parent:IHitpointBar;
    /**
     * The visual rectangle that can be altered to change the HitpointBar's appearance.
     */
    public rectangle:Rectangle;

    public get transparency():number
    {
        return this._transparency;
    }
    /**
     * The transparency of the HitpointBar (between 0.0 and 1.0)
     */
    public set transparency(value:number)
    {
        this._transparency = value;
        this.update();
    }
    /**
     * Creates a new instance of HitpointBarElement.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     * @param lineWidth Width of the line going around the visible rectangle.
     * @param parent The parent IHitpointBar.
     */
    constructor(fillStyle:Color, strokeStyle:Color, lineWidth:number, parent:IHitpointBar)
    {
        this.rectangle = new Rectangle(0, 0, 0, 0);
        this.rectangle.origin = RectangleOrigin.TopLeft;
        this.rectangle.fillStyle = fillStyle;
        this.rectangle.strokeStyle = strokeStyle;
        this.rectangle.lineWidth = lineWidth;
        this._parent = parent;
    }
    /**
     * Renders the HitpointBarElement.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    public render(ctx:CanvasRenderingContext2D):void
    {
        this.rectangle.render(ctx);
    }

    /**
     * Updates the IHitpointBarElement.
     */
    public update()
    {
        this.rectangle.fillStyle.alpha = this._transparency;
        this.rectangle.strokeStyle.alpha = this._transparency;
    }
}

/**
 * Represents HitPointBar background.
 */
export class HitpointBarBase extends HitpointBarElement
{
    /**
     * Creates a new instance of HitpointBarBase.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     * @param lineWidth Width of the line going around the visible rectangle.
     * @param parent The parent IHitpointBar.
     */
    constructor(fillStyle:Color, strokeStyle:Color, lineWidth:number, parent:IHitpointBar)
    {
        super(fillStyle, strokeStyle, lineWidth, parent);
        this.rectangle.stroke = false;
    }
}

/**
 * Represents HitPointBar progress.
 */
export class HitpointBarProgress extends HitpointBarElement
{
    /**
     * Creates a new instance of HitpointBarProgress.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     * @param lineWidth Width of the line going around the visible rectangle.
     * @param parent The parent IHitpointBar.
     */
    constructor(fillStyle:Color, strokeStyle:Color, lineWidth:number, parent:IHitpointBar)
    {
        super(fillStyle, strokeStyle, lineWidth, parent);
        this.rectangle.stroke = false;
    }
}

/**
 * Minimum implementation of a Hitpoint bar.
 */
export interface IHitpointBar
{
    /**
     * Owner of the HitpointBar.
     */
    owner:IHitpointBarOwner;
    /**
     * Background of the HitpointBar.
    */   
    base:IHitpointBarElement;
    /**
     * Foreground (actual progress indicator) of the HitpointBar.
    */   
    progress:IHitpointBarElement;
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
export interface IHitpointBarOwner
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
export interface IHitpointBarElement
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

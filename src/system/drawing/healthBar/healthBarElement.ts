import {IHealthBar, IHealthBarElement} from './healthBar';
import Color from '../../component/color';
import Rectangle, {RectangleOrigin} from '../../drawing/rectangle';

/**
 * Represents abtract implementation of HitPointBar base and progress elements.
 */
export abstract class HealthBarElement implements IHealthBarElement
{
    private _transparency:number = 1.0;
    /**
     * The parent object.
     */
    private _parent:IHealthBar;
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
    constructor(fillStyle:Color, strokeStyle:Color, lineWidth:number, parent:IHealthBar)
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
export class HealthBarBase extends HealthBarElement
{
    /**
     * Creates a new instance of HitpointBarBase.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     * @param lineWidth Width of the line going around the visible rectangle.
     * @param parent The parent IHitpointBar.
     */
    constructor(fillStyle:Color, strokeStyle:Color, lineWidth:number, parent:IHealthBar)
    {
        super(fillStyle, strokeStyle, lineWidth, parent);
        this.rectangle.stroke = false;
    }
}

/**
 * Represents HitPointBar progress.
 */
export class HealthBarProgress extends HealthBarElement
{
    /**
     * Creates a new instance of HitpointBarProgress.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     * @param lineWidth Width of the line going around the visible rectangle.
     * @param parent The parent IHitpointBar.
     */
    constructor(fillStyle:Color, strokeStyle:Color, lineWidth:number, parent:IHealthBar)
    {
        super(fillStyle, strokeStyle, lineWidth, parent);
        this.rectangle.stroke = false;
    }
}

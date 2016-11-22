import {RotatableRenderable} from './renderable/rotatableRenderable';
import Vector2D from '../component/vector2d';
import Size from '../component/size';
import Color from '../component/color';

/**
 * Represents a renderable text label.
 */
export default class Text extends RotatableRenderable
{
    /**
     * The actual string value that is rendered.
     */
    public text:string = '';
    /**
     * The font used to render the text.
     */
    public font:string = '16px Monospace';
    /**
     * Text align.
     */
    public textAlign:string = TextAlign.Start;
    /**
     * Text base line.
     */
    public textBaseLine:string = TextBaseLine.Alphabetic;
    /**
     * Text direction.
     */
    public textDirection:string = TextDirection.Inherit;
    /**
     * Creates a new instance of Text.
     * @param x The x component of the position vector.
     * @param y The y component of the position vector.
     * @param text The text.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     */
    constructor(x:number = 0, y:number = 0, text:string = '', fillStyle:Color = Color.black, strokeStyle:Color = Color.white)
    {
        super(x, y, fillStyle, strokeStyle);

        this.text = text;
    }
    /**
     * Renders the Text.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    public render(ctx:CanvasRenderingContext2D):void
    {
        this.beginRender(ctx);

        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseLine;
        (<any>ctx).direction = this.textDirection;

        if (this.fill)
        {
            ctx.fillText(this.text, this.position.x, this.position.y);
        }

        if (this.stroke)
        {
            ctx.strokeText(this.text, this.position.x,  this.position.y);
        }
    }
    /**
     * Not supported.
     */
    public intersects(position:Vector2D):boolean
    {
        throw new Error('Text does not support method "intersects()".');
    }
}

/**
 * Text align
 */
export const TextAlign =
{
    /**
     * Start (default)
     */
    Start: 'start',
    /**
     * End
     */
    End: 'end',
    /**
     * Left
     */
    Left: 'left',
    /**
     * Right
     */
    Right: 'right',
    /**
     * Center
     */
    Center: 'center'
}

/**
 * Text base line
 */
export const TextBaseLine = 
{
    /**
     * Top
     */
    Top: 'top',
    /**
     * Hanging
     */
    Hanging: 'hanging',
    /**
     * Middle
     */
    Middle: 'middle',
    /**
     * Alphabetic (Default)
     */
    Alphabetic: 'alphabetic',
    /**
     * Ideographic
     */
    Ideographic: 'ideographic',
    /**
     * Bottom
     */
    Bottom: 'bottom',
}
/**
 * Text direction
 */
export const TextDirection =
{
    /**
     * Left to right. Default value
     */
    LeftToRight: 'ltr',
    /**
     * Right to left
     */
    RightToLeft: 'rtl',
    /**
     * Inherit
     */
    Inherit: 'inherit'
}
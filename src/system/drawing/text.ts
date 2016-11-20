import {RotatableRenderable} from './rotatableRenderable';
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
    public font:string = '16px Monospace';

    public textAlign:string = TextAlign.start;
    public textBaseLine:string = TextBaseLine.alphabetic;
    public textDirection:string = TextDirection.inherit;

    constructor(x:number = 0, y:number = 0, text:string = '', fillStyle:Color = Color.black, strokeStyle:Color = Color.white)
    {
        super(x, y, fillStyle, strokeStyle);

        this.text = text;
    }

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

    public intersects(position:Vector2D):boolean
    {
        return false;
    }
}

export const TextAlign =
{
    /**
     * Default
     */
    start: 'start',
    end: 'end',
    left: 'left',
    right: 'right',
    center: 'center'
}

export const TextBaseLine = 
{
    top: 'top',
    hanging: 'hanging',
    middle: 'middle',
    /**
     * Default
     */
    alphabetic: 'alphabetic',
    ideographic: 'ideographic',
    bottom: 'bottom',
}

export const TextDirection =
{
    ltr: 'ltr',
    rtl: 'rtl',
    inherit: 'inherit'
}
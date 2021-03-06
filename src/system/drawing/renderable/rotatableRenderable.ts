import {BaseRenderable} from './baseRenderable';
import Color from '../../component/color';
/**
 * Represents Renderable that can only be rotated by rotating the canvas context.
 */
export abstract class RotatableRenderable extends BaseRenderable
{
    private _applyRotationTransform = false;

    private _rotation : number;
    /**
     * The rotation of the Renderable.
     */
    public get rotation() : number 
    {
        return this._rotation;
    }
    /**
     * The rotation of the Renderable.
     */
    public set rotation(value : number) 
    {
        this._rotation = value;
        this._applyRotationTransform = this._rotation !== 0;
    }
    
    /**
     * Creates a new instance of RotatableRenderable.
     * @param x The x component of the position.
     * @param y The y component of the position.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     */
    constructor(x:number, y:number, fillStyle:Color, strokeStyle:Color)
    {
        super(x, y, fillStyle, strokeStyle);
    }
    /**
     * Intiates the rendering process by setting all the necessary properties.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    protected beginRender(ctx:CanvasRenderingContext2D):void
    {
        super.beginRender(ctx);

        if (this._applyRotationTransform)
        {
            ctx.save();
            ctx.translate(this._position.x, this._position.y);
            ctx.rotate(this.rotation);
            ctx.translate(-this._position.x, -this._position.y);
        }
    }
    /**
     * Finalizes the rendering process.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    protected endRender(ctx:CanvasRenderingContext2D):void
    {
        super.endRender(ctx);

        if (this._applyRotationTransform)
        {
            ctx.restore();
        }
    }
}

import EventHandler from '../component/event/eventHandler';

/**
 * Represents a 2-dimensional size (width and height).
 */
export default class Size
{
    private _width:number = 0;
    private _height:number = 0;
    private _onChanged = new EventHandler<SizeOnChangedCallback>();

    /**
     * The event handler that reacts to the changes of width and height properties.
     */
    public get onChanged():EventHandler<SizeOnChangedCallback>
    {
        return this._onChanged;
    }
    /**
     * The width of the size.
     */
    public get width():number
    {
        return this._width;
    }
    /**
     * The width of the size.
     */
    public set width(value:number)
    {
        let previousWidth = this._width;
        this._width = value;
        this._onChanged.trigger(this, previousWidth, this._height);
    }
    /**
     * The height of the size.
     */
    public get height():number
    {
        return this._height;
    }
    /**
     * The height of the size.
     */
    public set height(value:number)
    {
        let previousHeight = this._height;
        this._height = value;
        this._onChanged.trigger(this, this._width, previousHeight);
    }
    /**
     * The area of the size.
     */
    public get area():number
    {
        return this.width * this.height;
    }
    /**
     * Creates a new instance of Size.
     */
    constructor()
    /**
     * Creates a new instance of Size.
     * @param size Existing size to copy width and height from.
     */
    constructor(size:Size)
    /**
     * Creates a new instance of Size.
     * @param width The width of the size.
     * @param height The height of the size.
     */
    constructor(width:number, height:number)
    constructor(sizeOrWidth?: number|Size, height?:number)
    {
        this.width = sizeOrWidth instanceof Size ? sizeOrWidth.width : sizeOrWidth !== undefined ? sizeOrWidth : 0;
        this.height = height !== undefined ? height : 0;
    }
}

/**
 * Size.onChanged callback type.
 */
export interface SizeOnChangedCallback
{
    /**
     * @param sender The Sender of the event.
     * @param oldWidth The previous width component value before the change.
     * @param oldHeight The previous height value before the change.
     */
    (sender:Size, oldWidth:number, oldHeight:number):void;
}
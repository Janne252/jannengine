import EventHandler from '../event/eventHandler';
import Range, {RangeOnChangedCallback} from './range';
import {IVector2D} from '../drawing/vector2D';
import {IPadding} from '../drawing/padding';
/**
 * Represents 2-dimensional range (x, y).
 */
export default class XYRange
{
    private _onChanged = new EventHandler<XYRangeOnChangedCallback>();
    private _xRange:Range;
    private _yRange:Range;

    /**
     * The x range.
     */
    public get xRange():Range
    {
        return this._xRange;
    }
    /**
     * The y range.
     */
    public get yRange():Range
    {
        return this._yRange;
    }
    /**
     * Smallest x value of the x range.
     */
    public get minX():number
    {
        return this._xRange.min;
    }  
    /**
     * Largets x value of the x range.
     */ 
    public get maxX():number
    {
        return this._xRange.max;
    }  
    /**
     * Smallest y value of the y range.
     */
    public get minY():number
    {
        return this._yRange.min;
    }
    /**
     * Largets y value of the y range.
     */ 
    public get maxY():number
    {
        return this._yRange.max;
    }
    /**
     * Event handler that is triggered when the x or the y range changes.
     */
    public get onChanged():EventHandler<XYRangeOnChangedCallback>
    {
        return this._onChanged;
    }
    /**
     * Event handler that is triggered when the x range changes.
     */
    public get xRangeOnChanged():EventHandler<RangeOnChangedCallback>
    {
        return this._xRange.onChanged;
    }
    /**
     * Event handler that is triggered when the y range changes.
     */
    public get yRangeOnChanged():EventHandler<RangeOnChangedCallback>
    {
        return this._yRange.onChanged;
    }

    /**
     * Creates a new instance of XYRange from an existing XYRange.
     * @param xyRange The XYRange to copy the ranges from.
     */
    constructor(xyRange:XYRange)
    /**
     * Creates a new instance of XYRange from existing ranges.
     * @param xRange The x range to copy the values from.
     * @param yRange The y range to copy the values from.
     */
    constructor(xRange:Range, yRange:Range)
    /**
     * Creates a new instance of XYRange.
     * @param xMin: Minimum x value.
     * @param xMax: Maximum x value.
     * @param yMin: Minimum y value.
     * @param yMax: Maximum y value.
     */
    constructor(xMin:number, xMax:number, yMin:number, yMax:number)
    constructor(xMinOrXRangeOrXYRange:number|Range|XYRange, xMaxOrYRange?:number|Range, yMin?:number, yMax?:number)
    {
        this._xRange = new Range(0, 0);
        this._yRange = new Range(0, 0);

        if (xMinOrXRangeOrXYRange instanceof XYRange)
        {
            this._xRange.set(xMinOrXRangeOrXYRange.xRange);
            this._yRange.set(xMinOrXRangeOrXYRange.yRange);
        }
        else if (xMinOrXRangeOrXYRange instanceof Range && xMaxOrYRange instanceof Range)
        {
            this._xRange.set(xMinOrXRangeOrXYRange);
            this._yRange.set(xMaxOrYRange);
        }
        else if (xMinOrXRangeOrXYRange instanceof Number && xMaxOrYRange instanceof Number)
        {
            this._xRange.min = xMinOrXRangeOrXYRange;
            this._xRange.max = xMaxOrYRange !== undefined ? xMaxOrYRange : 0;
            this._yRange.min = yMin !== undefined ? yMin : 0;
            this._yRange.max = yMax !== undefined ? yMax : 0;
        }

        this._xRange.onChanged.subscribe(this.rangeOnChanged);
        this._yRange.onChanged.subscribe(this.rangeOnChanged);
    }
    /**
     * Reacts to x or y range changes.
     */
    protected rangeOnChanged = (sender:Range) =>
    {
        this._onChanged.trigger(this);
    }
    /**
     * Re-calculates min and max values.
     * @param items Source items.
     */
    public recalculate<T extends IVector2D>(items: IVector2D[]):void
    {
        this.xRange.recalculate((item:T) => item.x, items);
        this.yRange.recalculate((item:T) => item.y, items);
    }
    /**
     * Copies the min and max values from an existing XYRange.
     * @param range The source XYRange.
     */
    public set(range: XYRange):void
    {
        this._xRange.min = range.xRange.min;
        this._xRange.max = range.xRange.max;
        this._yRange.min = range.yRange.min;
        this._yRange.max = range.yRange.max;
    }
    /**
     * Returns a copy of the XYRange with padding applied.
     * @param padding The padding to apply to the range.
     * Returns the new XYRange.
     */
    public withPadding(padding:IPadding):XYRange
    {
        if (padding === undefined)
        {
            return new XYRange(this);
        }
        else
        {
            return new XYRange(this._xRange.min + padding.left, this._xRange.max - padding.right, this._yRange.min + padding.top, this._yRange.max - padding.bottom);
        }
    }
    /**
     * Creates a new instance of XYRange from IVector2D[] collection.
     * @param items The IVector2D[] to create the range from.
     * Returns the result XYRange.
     */
    public static from<T extends IVector2D>(items: IVector2D[]):XYRange
    {
        return new XYRange(Range.from((item:T) => item.x, items), Range.from((item:T) => item.y, items));
    }
}

/**
 * XYRange.onChanged callback type.
 */
export interface XYRangeOnChangedCallback
{
    /**
     * @param sender The XYRange that triggered the event.
     */
    (sender:XYRange);
}
import EventHandler from '../event/eventHandler';
import {min, max} from '../../helpers/math';

/**
 * Represents a range constisting of minimum and maximum values.
 */
export default class Range
{
    private _min:number;
    private _max:number;
    private _onChanged = new EventHandler<RangeOnChangedCallback>();

    /**
     * Event handler that is triggered when the min or the max value is changed.
     */
    public get onChanged(): EventHandler<RangeOnChangedCallback>
    {
        return this._onChanged;
    }
    /**
     * Minimum value of the Range.
     */
    public get min():number
    {
        return this._min;
    }
    /**
     * Minimum value of the Range.
     */
    public set min(value:number)
    {
        let previosMin = this._min;
        this._min = value;
        this._onChanged.trigger(this, previosMin, this._max);
    }    
    /**
     * Maximum value of the Range.
     */
    public get max():number
    {
        return this._max;
    }
    /**
     * Maximum value of the Range.
     */    
    public set max(value:number)
    {
        let previosMax = this._max;
        this._max = value;
        this._onChanged.trigger(this, this._min, previosMax);
    }

    /**
     * Creates a new instance of Range by copying value from an existing Range.
     * @param range The range to copy the values from.
     */
    constructor(range:Range)
    /**
     * Creates a new instance of Range.
     * @param min The minimum value.
     * @param max The maximum value.
     */
    constructor(min:number, max:number)
    constructor(minOrRange: number|Range, max?:number)
    {
        if (minOrRange instanceof Range)
        {
            this.min = minOrRange.min;
            this.max = minOrRange.max;
        }
        else
        {
            this._min = minOrRange;
            this._max = max !== undefined ? max : 0;
        }

    }
    /**
     * Updates the Range by re-calculating the min and max value from a collection.
     */
    public recalculate<T>(selector: (item:T) => number, items: T[]):void
    {
        this.min = min(selector, items);
        this.max = max(selector, items);
    }
    /**
     * Copies the min and max values from an existing Range.
     * @param range The source Range.
     */
    public set(range:Range):void
    {
        this.min = range !== undefined ? range.min : 0;
        this.max = range !== undefined ? range.max : 0;
    }
    /**
     * Creates a new instance of Range from a collection of objects.
     * @param selector The arrow function used to select the compared property.
     * @param items The source array of items.
     * Returns the result Range.
     */
    public static from<T>(selector:(o:T) => number, items: T[]):Range
    {
        return new Range(min(selector, items), max(selector, items));
    }
}

/**
 * Range.onChanged callback type.
 */
export interface RangeOnChangedCallback
{
    /**
     * @param sender The Range that triggered the event.
     * @param previousMin Previous min value.
     * @param previousMax Previous max value.
     */
    (sender:Range, previousMin:number, previousMax:number);
}
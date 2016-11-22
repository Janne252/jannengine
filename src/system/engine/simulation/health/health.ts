import EventHandler from '../../../component/event/eventHandler';
import {clamp} from '../../../helpers/math';

/**
 * Represents entity health (hitpoints) value.
 */
export default class Health
{
    private _value:number;
    private _onChanged = new EventHandler<HealthOnChangedCallback>();
    
    public get onChanged():EventHandler<HealthOnChangedCallback>
    {
        return this._onChanged;
    }

    /**
     * Maximum hitpoints value. 
     */
    public max:number = 1000;

    /**
     * Minimum hitpoints value. 
     */
    public min:number = 0;

    /**
     * Current hitpoints value.
     */
    public get value():number
    {
        return this._value;
    }

    /**
     * Current hitpoints value.
     * @param value The new value to set the value to.
     */
    public set value(value:number)
    {
        let oldValue = this._value;

        this._value = clamp(value, this.min, this.max);
        this.onChanged.trigger(this, oldValue, value);
    }

    /**
     * Creates a new instance of Hitpoints.
     * @param value Initial hitpoints value.
     * @param number Maximum number of hitpoints.
     */
    constructor(value:number, max:number)
    {
        this._value = value;
        this.max = max;
    }

    /**
     * Add hitpoints.
     * @param value Value to add.
     */
    public add(value:number):void
    {
        this.value = clamp(this._value + value, this.min, this.max);
    }

    /**
     * Subtract hitpoints.
     * @param value Value to subtract.
     */
    public subtract(value:number):void
    {
        this.add(-value);
    }

    /**
     * Whether or not the hitpoints value has reached the minimum value.
     */
    public get isDead():boolean
    {
        return this._value == this.min;
    }

    /**
     * The percentage representation of the current hitpoints value (between 0.0 and 1.0).
     */
    public get percentage():number
    {
        return this._value / this.max;
    }
}

/**
 * Callback type for Hitpoints.onChanged event handler.
 */
export interface HealthOnChangedCallback
{
    /**
     * @param sender The initiator of the event.
     * @param oldValue Previous hitpoints value.
     * @param newValue The new hitpoints value.
     */
    (sender:Health, oldValue:number, newValue:number):void;
}
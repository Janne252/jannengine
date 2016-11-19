import EventHandler from '../event/eventHandler';
import {lerp} from '../helpers/math';

/**
 * Represents a 2-dimensional vector that has the components x and y.
 */
export default class Vector2D implements IVector2D
{
    private _x:number = 0;
    private _y:number = 0;

    private _onChanged = new EventHandler<Vector2DOnChangedCallback>();

    /**
     * EventHandler that is triggered when the x or y component is changed.
     */
    public get onChanged():EventHandler<Vector2DOnChangedCallback>
    {
        return this._onChanged;
    }
    /**
     * The x component of the vector.
     */
    public get x():number
    {
        return this._x;
    }
    /**
     * The x component of the vector.
     */
    public set x(value:number)
    {
        let previous = this._x;
        this._x = value;
        this.onChanged.trigger(this, previous, this._y);
    }
    /**
     * The y component of the vector.
     */
    public get y():number
    {
        return this._y;
    }
    /**
     * The y component of the vector.
     */    
    public set y(value:number)
    {
        let previous = this._y;
        this._y = value;
        this.onChanged.trigger(this, this._x, previous);
    }
    /**
     * Creates a new instance of Vector2D.
     */
    constructor()
    /**
     * Creates a new instance of Vector2D.
     * @param vector The vector to create the vector from.
     */
    constructor(vector:Vector2D)
    /**
     * Creates a new instance of Vector2D.
     * @param x X component of the new vector.
     * @param y Y component of the new vector.
     */
    constructor(x:number, y:number)
    constructor(xOrVector?: number|Vector2D, y?:number)
    {
        this._x = Vector2D._xFromVectorOrNumber(xOrVector);
        this._y = Vector2D._yFromVectorOrNumber(xOrVector, y);
    }   
    /**
     * Adds a vector to a vector (x + x, y + y).
     * @param vector The vector to add.
     * Returns the result vector.
     */
    public add(vector: Vector2D): Vector2D
    {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }
    /**
     * Subtracts a vector from the vector (x - x, y - y).
     * @param vector The vector to subtract.
     * Returns the result vector.
     */
    public subtract(vector: Vector2D):Vector2D
    {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }
    /**
     * Mulitplies the vector with a mulitplier.
     * @param multiplier The multiplier.
     * Returns the result vector.
     */
    public multiply(multiplier:number):Vector2D
    {
        return new Vector2D(this.x * multiplier, this.y * multiplier);
    }
    /**
     * Sets the vector's x and y components to the values of a vector.
     * @param vector The vector to copy the x and y components from.
     */
    public set(vector:Vector2D):void
    {
        this.x = vector.x;
        this.y = vector.y;
    }
    /**
     * Linerry interpolates the vector x and y components towards a vector by a step percentage.
     * @param vector The vector to lerp towards.
     * @param stepPercentage The step percentage.
     * Returns the result vector.
     */
    public lerp(vector:Vector2D, stepPercentage:number):Vector2D
    {
        var targetX:number = vector.x;
        var targetY:number = vector.y;

        return new Vector2D(lerp(this.x, targetX, stepPercentage), lerp(this.y, targetY, stepPercentage));
    }
    /**
     * Returns a copy of the current vector that is moved towards an angle by an offset.
     * @param offset The distance to move the vector.
     * @param angle The angle in radians.
     * Returns the result vector.
     */
    public getOffsetTowardsAngle(offset:number, angle:number):Vector2D
    {
        return new Vector2D(this.x + offset * Math.cos(angle), this.y + offset * Math.sin(angle));
    }
    /**
     * Returns the angle in radians towards a vector.
     * @param vector The vector the angle is measured against.
     * Returns number The result angle in radians.
     */
    public getAngleTowardsVector(vector:Vector2D):number
    /**
     * Returns the angle in radians towards a vector.
     * @param x The x component of the target vector.
     * @param y The y component of the target vector.
     * Returns number The result angle in radians.
     */
    public getAngleTowardsVector(x:number, y:number):number
    public getAngleTowardsVector(xOrVector: number|Vector2D, y?:number):number
    {
        var targetX:number = Vector2D._xFromVectorOrNumber(xOrVector);
        var targetY:number = Vector2D._yFromVectorOrNumber(xOrVector, y);

       return Math.atan2(targetY - this.y, targetX - this.x);
    }
    /**
     * Returns a copy of the current vector that is moved towards a vector by an offset.
     * @param offset The distance to move the vector.
     * @param vector The vector to move towads.
     * @param overshoot Wheter or not going past the target vector is allowed.
     * Returns The result vector.
     */
    public getOffsetTowardsVector(offset:number, vector:Vector2D, overshoot:boolean = true):Vector2D
    {
        var targetX:number = vector.x;
        var targetY:number = vector.y;

        if (!overshoot)
        {
            let target = new Vector2D(targetX, targetY);
            let distance = this.distanceTo(target);

            if (distance <= offset)
            {
                return target;
            }
        }

        return this.getOffsetTowardsAngle(offset, this.getAngleTowardsVector(targetX, targetY));
    }
    /**
     * Measures the distance to a vector.
     * @param vector The vector to measure the distance to.
     * Returns The distance.
     */
    public distanceTo(vector:Vector2D):number
    /**
     * Measures the distance to a vector (x and y components).
     * @param x The x component of the target vector.
     * @param y The y component of the target vector.
     * Returns The distance.
     */
    public distanceTo(x:number, y:number)
    public distanceTo(xOrVector: number|Vector2D, y?:number)
    {
        var targetX:number = Vector2D._xFromVectorOrNumber(xOrVector);
        var targetY:number = Vector2D._yFromVectorOrNumber(xOrVector, y);
        
        return Math.sqrt(Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2));
    }
    /**
     * Calculates the length of the vector.
     * Returns the length of the vector.
     */
    public length():number
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * Returns the normalized vector of the vector.
     */
    public normalized():Vector2D
    {
        var length = this.length();

        return length == 0 ? new Vector2D(0, 0) : new Vector2D(this.x / length, this.y / length);
    }
    /**
     * Checks if a vector has the same x and y components as another vector.
     * @param vector The vector to check against.
     * Returns true if the vectors have the same components.
     */
    public equals(vector:Vector2D):boolean
    {
        return vector !== undefined && this.x === vector.x && this.y === vector.y;
    }
    /**
     * Creates a copy of the current Vector2D and returns it.
     */
    public copy():Vector2D
    {
        return new Vector2D(this);
    }
    /**
     * Converts the vector to a string representation.
     * Returns the string.
     */
    public toString():string
    {
        return `[${this.x}, ${this.y}]`;
    }

    private static _xFromVectorOrNumber(vector: number|Vector2D):number
    {
        return vector instanceof Vector2D ? vector.x : vector !== undefined ? vector : 0;
    }    
    
    private static _yFromVectorOrNumber(vector: number|Vector2D, y:number):number
    {
        return vector instanceof Vector2D ? vector.y : y !== undefined ? y : 0;
    }
    
}

/**
 * Vector.onChanged callback type.
 */
export interface Vector2DOnChangedCallback
{
    /**
     * @param sender The Sender of the event.
     * @param oldX The previous x component value before the change.
     * @param oldY The previous y component value before the change.
     */
    (sender:Vector2D, oldX:number, oldY:number):void;
}

export interface IVector2D
{
    x:number;
    y:number;
}
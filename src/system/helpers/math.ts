/**
 * Converts degrees (°) to radians.
 * @param degrees The degrees to convert.
 * Returns the result radians.
 */
export function radians(degrees:number):number
{
    return degrees * Math.PI / 180;
}
/**
 * Converts radians (c) to degrees.
 * @param radians The radians to convert.
 * Returns the result degrees.
 */
export function degrees(radians:number):number
{
    return radians * 180 / Math.PI;
}
/**
 * Normalizes radians to the standard range (-Math.PI - Math.PI).
 * @param radians The radians to normalize.
 * Returns the normalized radians.
 */
export function normalizeRadians(radians:number):number
{
    return Math.atan2(Math.sin(radians), Math.cos(radians));
}
/**
 * Rotates an angle (radians) towards an angle (radians) by the shortest way.
 * @param source The source angle (radians) to rotate.
 * @param target The target angle (radians) to rotate to.
 * @param step How many radians to advance towards the target rotation.
 * Returns the result angle (radians).
 */
export function rotateTowards(source, target, step)
{       
    var diff = Math.abs(source - target);

    var result = source;

    if(diff < Math.PI && target > source)
    {
        result = source + step;
    }
    else if(diff < Math.PI && target < source)
    {
        result = source - step;
    }    
    else if(diff > Math.PI && target > source)
    {
        result = source - step;
    }
    else if(diff > Math.PI && target < source)
    {
        result = source + step;
    }
    else if(diff == Math.PI)
    {
        result = source + step;
    }

    //Normalize angle
    result = normalizeRadians(result);

    if ((result > target && result - step < target) || (result < target && result + step > target))
    {
        result = target;
    }
    
    return result;
}
/**
 * Maps a value from a range to another range linearly.
 * @param value The value to map.
 * @param fromRangeMin The source range minimum (beginning) value.
 * @param fromRangeMax The source range maximum (end) value.
 * @param toRangeMin The target range minimum (beginning) value.
 * @param toRangeMax The target range maximum (end) value.
 * Returns the result mapped value.
 */
export function map(value:number, fromRangeMin:number, fromRangeMax:number, toRangeMin:number, toRangeMax:number):number
{
    return (value - fromRangeMin) * (toRangeMax - toRangeMin) / (fromRangeMax - fromRangeMin) + toRangeMin;
}
/**
 * Linearly interpolates a value towards a target value by a step percentage.
 * @param value The value to interpolate.
 * @param targetValue The value to interpolate towards.
 * @param stepPercentage How big chunk of the difference is taken.
 * Returns the linearly interpolated result value.
 */
export function lerp(value:number, targetValue:number, stepPercentage:number):number
{
    return value * (1 - stepPercentage) + targetValue * stepPercentage;
}
/**
 * Clamps a value by limiting it between minimum and maximum values.
 * @param value The value to clamp.
 * @param min The miminum value.
 * @param max The maximum value.
 * Returns min if the value is less than min. Returns max if the value is larger than max. Returns the same value otherwise.
 */
export function clamp(value:number, min:number, max:number)
{
    if (value < min)
    {
        return min;
    }   
    else if(value > max)
    {
        return value;
    }
    else
    {
        return value;
    }
}
/**
 * Calculates the hypotenuse of a right triangle based on the 2 shorter vertices. 
 * @param a Vertice a length.
 * @param b Vertice b length.
 * Returns the length of the hypotenuse.
 */
export function hypot(a:number, b:number)
{
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}
/**
 * Returns the smallest value occurring in the collection.
 * @param selector Selector used to get the comparable number value.
 * @param items Source items to iterate over.
 * Returns the smallest occurring number value.
 */
export function min<T>(selector:(o:T) => number, items:T[]):number
{
    return _minOrMax(true, selector, items);
}
/**
 * Returns the largest value occurring in the collection.
 * @param selector Selector used to get the comparable number value.
 * @param items Source items to iterate over.
 * Returns the largest occurring number value.
 */
export function max<T>(selector:(o:T) => number, items:T[]):number
{
    return _minOrMax(false, selector, items);
}
/**
 * Inner function used as the repeating part for min and max functions.
 * @param min If true, smallest value is returned. If set to false, largest.
 * @param selector Selector used to get the comparable number value.
 * @param items Source items to iterate over.
 * Returns the smallest or the largest value.
 */
function _minOrMax<T>(min:boolean, selector:(o:T) => number, items:T[]):number
{
    let result = min ? Number.MAX_VALUE : Number.MIN_VALUE;
    let item:T;

    for(let i = 0; i < items.length; i++)
    {
        item = items[i];

        let value = selector(item);

        if (min)
        {
            if (value < result)
            {
                result = value;
            }
        }
        else
        {
            if (value > result)
            {
                result = value;
            }
        }
    }
    
    return result;
}
/**
 * Checks if a polygon (an array of {x, y} objects) contains a position ({x, y} object).
 * @param vertices The array of {x, y} objects that form the polygon.
 * @param vector The position to check.
 * Returns true if the position is inside the polygon.
 */
export function polygon_intersects(vertices: {x: number, y: number}[], vector: {x: number, y: number}): boolean
{
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = vector.x, y = vector.y;
    
    var inside = false;

    for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++)
    {
        var xi = vertices[i].x, yi = vertices[i].y;
        var xj = vertices[j].x, yj = vertices[j].y;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
}

export const TWO_PI = 6.28318530718;
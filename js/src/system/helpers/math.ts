export function radians(degrees:number):number
{
    return degrees * Math.PI / 180;
}

export function degrees(radians:number):number
{
    return radians * 180 / Math.PI;
}

export function normalizeRadians(radians:number):number
{
    return Math.atan2(Math.sin(radians), Math.cos(radians));
}


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

export function map(value:number, fromRangeMin:number, fromRangeMax:number, toRangeMin:number, toRangeMax:number):number
{
    return (value - fromRangeMin) * (toRangeMax - toRangeMin) / (fromRangeMax - fromRangeMin) + toRangeMin;
}

export function lerp(startValue:number, targetValue:number, stepPercentage:number):number
{

    return startValue * (1 - stepPercentage) + targetValue * stepPercentage;
}

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

export function hypot(a:number, b:number)
{
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

export function min<T>(selector:(o:T) => number, items:T[]):number
{
    return minOrMax(true, selector, items);
}

export function max<T>(selector:(o:T) => number, items:T[]):number
{
    return minOrMax(false, selector, items);
}

function minOrMax<T>(min:boolean, selector:(o:T) => number, items:T[]):number
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

export const TWO_PI = 6.28318530718;

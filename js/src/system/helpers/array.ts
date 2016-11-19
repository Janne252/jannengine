
export function array_remove<T>(source:T[], item:T, count:number = -1):void
{
    var existingItem:T;
    var removedCount = 0;

    for(var i = source.length - 1; i >= 0; i--)
    {
        existingItem = source[i];

        if (existingItem === item)
        {
            source.splice(i, 1);
            removedCount++;
            if (count != -1 && removedCount >= count)
            {
                break;
            }
        }
    }
}
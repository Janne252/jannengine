/**
 * Removes an item from an array.
 * @param source The source array to remove the item from.
 * @param item The item to remove from the array.
 * @param count Number of occurrances to remove. If set to -1 (default), all occurances will be removed.
 */
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

/**
 * Removes item(s) from an array based on a comparator.
 * @param source The source array to remove item(s) from.
 * @param comparator The arrow function used to determine if an item should be removed.
 * @param count Number of matches to remove. If set to -1 (default), all matches will be removed.
 */
export function array_removeExt<T>(source: T[], comparator: (item: T) => boolean, count: number = -1):void
{
    var removedCount: number = 0;
    var existingItem: T;

    for(var i = source.length - 1; i >= 0; i--)
    {
        existingItem = source[i];

        if(comparator(existingItem))
        {
            source.splice(i, 1);
            removedCount++;

            if(count != -1 && removedCount >= count)
            {
                break;
            }
        }
    }
}

/**
 * Utility class for generating random numbers.
 */
export default class Random
{
    /**
     * Generates an integer between the provided numbers.
     * @param min Value range minimum.
     * @param max Value range maximum.
     * Returns The randomly selected integer.
     */
    public static next(min:number = 0, max:number = null)
    {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
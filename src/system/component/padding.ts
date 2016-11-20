/**
 * Represents CSS-like padding.
 */
export default class Padding implements IPadding
{
    /**
     * Top padding.
     */
    public top:number;
    /**
     * Right padding.
     */
    public right:number;
    /**
     * Bottom padding.
     */
    public bottom:number;
    /**
     * Left padding.
     */
    public left:number;

    /**
     * Creates a new instance of Padding with all directions set to 0.
     */
    constructor()
    /**
     * Creates a new instance of Padding with all directions set to the provided value.
     * @param all Value to set all directions to.
     */
    constructor(all:number)
    /**
     * Creates a new instance of Padding.
     * @param topAndBotton Value to set top and bottom values to.
     * @param leftAndRight Value to set left and right values to.
     */
    constructor(topAndBotton:number, leftAndRight:number)
    /**
     * Creates a new instance of Padding.
     * @param top Value to set top padding to.
     * @param right Value to set right padding to.
     * @param bottom Value to set bottom padding to.
     * @param left Value to set left padding to.
     */
    constructor(top:number, right:number, bottom:number, left:number)
    constructor(allOrTopAndBottomOrTop?:number, leftAndRightOrRight?:number, bottom?:number, left?:number)
    {
        if (allOrTopAndBottomOrTop === undefined && leftAndRightOrRight === undefined && bottom === undefined && left === undefined)
        {
            this.top = 0;
            this.right = 0;
            this.bottom = 0;
            this.left = 0;
        }
        else if (allOrTopAndBottomOrTop !== undefined && leftAndRightOrRight === undefined && bottom === undefined && left === undefined)
        {
            this.top = allOrTopAndBottomOrTop;
            this.right = allOrTopAndBottomOrTop;
            this.bottom = allOrTopAndBottomOrTop;
            this.left = allOrTopAndBottomOrTop;
        }
        else if(allOrTopAndBottomOrTop !== undefined && leftAndRightOrRight !== undefined && bottom === undefined && left === undefined)
        {
            this.top = allOrTopAndBottomOrTop;
            this.bottom = allOrTopAndBottomOrTop;
            this.right = leftAndRightOrRight;
            this.left = leftAndRightOrRight;
        }
        else
        {
            this.top = allOrTopAndBottomOrTop !== undefined ? allOrTopAndBottomOrTop : 0;
            this.right = leftAndRightOrRight !== undefined ? leftAndRightOrRight : 0;
            this.bottom = bottom !== undefined ? bottom : 0;
            this.left = left !== undefined ? left : 0;
        }
    }
}

/**
 * Defines the minimum implementation of Padding.
 */
export interface IPadding
{
    /**
     * Top padding.
     */
    top:number;
    /**
     * Right padding.
     */
    right:number;
    /**
     * Bottom padding.
     */
    bottom:number;
    /**
     * Left padding.
     */
    left:number;
}
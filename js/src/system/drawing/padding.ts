
export default class Padding implements IPadding
{
    public top:number;
    public right:number;
    public bottom:number;
    public left:number;

    constructor()
    constructor(all:number)
    constructor(topAndBotton:number, leftAndRight:number)
    constructor(top:number, right:number, bottom:number, left:number)
    constructor(allOrTopAndBottomOrTop?:number, leftAndRightOrRight?:number, bottom?:number, left?:number)
    {
        if (allOrTopAndBottomOrTop !== undefined && leftAndRightOrRight === undefined && bottom === undefined && left === undefined)
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

export interface IPadding
{
    top:number;
    right:number;
    bottom:number;
    left:number;
}
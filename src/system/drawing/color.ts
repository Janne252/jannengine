import Random from '../random';

export default class Color
{
    public r:number = 0;
    public g:number = 0;
    public b:number = 0;
    public alpha:number = 1;

    constructor()
    constructor(color:Color)
    constructor(r:number, g:number, b:number)
    constructor(r?:number, g?:number, b?:number, alpha?:number) 
    constructor(rOrColor?: number|Color, g?:number, b?:number, alpha?:number) 
    {
        if (rOrColor instanceof Color)
        {
            this.r = rOrColor.r;
            this.g = rOrColor.g;
            this.b = rOrColor.b;
            this.alpha = rOrColor.alpha;
        }
        else
        {
            let r = rOrColor;

            this.r = r !== undefined ? r : 0;
            this.g = g !== undefined ? g : 0;
            this.b = b !== undefined ? b : 0;
            this.alpha = alpha !== undefined ? alpha : 1;
        }
    }

    public toCSS():String
    {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
    }

    public toString():String
    {
        return this.toCSS();
    }

    public static fromHex(hexString:string)
    {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
        return result ? new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) : null;
    }

    public static random():Color
    {
        return new Color(Random.next(0, 256), Random.next(0, 256), Random.next(0, 256), 1);
    }

    public static get black():Color
    {
        return new Color(0, 0, 0, 1);
    }    
    
    public static get white():Color
    {
        return new Color(255, 255, 255, 1);
    }
    
    public static get grey():Color
    {
        return new Color(128, 128, 128, 1);
    }

    public static get red():Color
    {
        return new Color(255, 0, 0, 1);
    }

    public static get green():Color
    {
        return new Color(0, 255, 0, 1);
    }

    public static get blue():Color
    {
        return new Color(0, 0, 255, 1);
    }    
    
    public static get yellow():Color
    {
        return new Color(255, 255, 0, 1);
    }    
    
    public static get orange():Color
    {
        return new Color(255, 127, 0, 1);
    }
}
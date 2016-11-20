import Random from '../component/random';

/**
 * Represents a 32-bit RGB color with alpha (transparency) component.
 */
export default class Color
{
    /**
     * The red component of the color.
     */
    public red:number = 0;
    /**
     * The green component of the color.
     */
    public green:number = 0;
    /**
     * The blue component of the color.
     */
    public blue:number = 0;
    public alpha:number = 1;

    /**
     * Creates a new instance of Color.
     */
    constructor()
    /**
     * Creates a new instance of Color by copying the values from an existing Color.
     */
    constructor(color:Color)
    /**
     * Creates a new instance of Color.
     * @param red The red component of the color. 
     * @param green The green component of the color. 
     * @param blue The blue component of the color. 
     */
    constructor(red:number, green:number, blue:number)
    /**
     * Creates a new instance of Color with alpha.
     * @param red The red component of the color. 
     * @param green The green component of the color. 
     * @param blue The blue component of the color. 
     * @param alpha The alpha component of the color. 
     */
    constructor(red:number, green:number, blue:number, alpha:number) 
    constructor(rOrColor?: number|Color, g?:number, b?:number, alpha?:number) 
    {
        if (rOrColor instanceof Color)
        {
            this.red = rOrColor.red;
            this.green = rOrColor.green;
            this.blue = rOrColor.blue;
            this.alpha = rOrColor.alpha;
        }
        else
        {
            let r = rOrColor;

            this.red = r !== undefined ? r : 0;
            this.green = g !== undefined ? g : 0;
            this.blue = b !== undefined ? b : 0;
            this.alpha = alpha !== undefined ? alpha : 1;
        }
    }

    /**
     * Converts the Color to a CSS rgba(red, green, blue, alpha) string.
     * Returns the result string.
     */
    public toCSS():string
    {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }
    /**
     * Converts the Color to a CSS rgba(red, green, blue, alpha) string.
     * Returns the result string.
     */
    public toString():string
    {
        return this.toCSS();
    }
    /**
     * Creates a new Color from a hexadecimal representation, eg. #FF0000 resulting red.
     */
    public static fromHex(hexString:string)
    {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
        return result ? new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) : null;
    }
    /**
     * Generates a random color.
     * Returns the randomly generated color.
     */
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
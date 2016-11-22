import Random from '../component/random';

/**
 * Represents a 32-bit RGB color with alpha (transparency) component.
 */
export default class Color
{   
    private _red : number;
    private _green : number;
    private _blue : number;
    private _alpha : number;

    /**
     * CSS representation of this color, e.g. rgba(255, 255, 255, 1).
     */
    public cssString: string = '';
    /**
     * The red component of the RGB color, 0..255.
     */
    public get red() : number 
    {
        return this._red;
    }
    /**
     * The red component of the RGB color, 0..255.
     */
    public set red(value : number) 
    {
        this._red = value;
        this.update();
    }
    /**
     * The green component of the RGB color, 0..255.
     */
    public get green() : number 
    {
        return this._green;
    }
    /**
     * The green component of the RGB color, 0..255.
     */
    public set green(value : number) 
    {
        this._green = value;
        this.update();
    }
    /**
     * The blue component of the RGB color, 0..255.
     */
    public get blue() : number 
    {
        return this._blue;
    }
    /**
     * The blue component of the RGB color, 0..255.
     */
    public set blue(value : number) 
    {
        this._blue = value;
        this.update();
    }
    /**
     * The alpha component of the RGB color, 0..1.
     */
    public get alpha() : number 
    {
        return this._alpha;
    }
    /**
     * The alpha component of the RGB color, 0..1.
     */
    public set alpha(value : number) 
    {
        this._alpha = value;
        this.update();
    }
    
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
            this._red = rOrColor.red;
            this._green = rOrColor.green;
            this._blue = rOrColor.blue;
            this._alpha = rOrColor.alpha;
        }
        else
        {
            let r = rOrColor;

            this._red = r !== undefined ? r : 0;
            this._green = g !== undefined ? g : 0;
            this._blue = b !== undefined ? b : 0;
            this._alpha = alpha !== undefined ? alpha : 1;
        }

        this.update();
    }

    public update():void
    {
        this.cssString = `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }
    /**
     * Converts the Color to a CSS rgba(red, green, blue, alpha) string.
     * Returns the result string.
     */
    public toCSS():string
    {
        return this.cssString;
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
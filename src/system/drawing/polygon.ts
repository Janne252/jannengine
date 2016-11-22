import {BaseRenderable} from './renderable/baseRenderable';
import Vector2D from '../component/vector2d';
import Size from '../component/size';
import Color from '../component/color';
import Padding, {IPadding} from '../component/padding';
import {min, max, polygon_intersects} from '../helpers/math';
import Random from '../component/random';
import Range from '../component/range/range';
import XYRange from '../component/range/xyRange';

/**
 * Represents a polygon with n number of vertices.
 */
export default class Polygon extends BaseRenderable
{
    private _vertices:Vector2D[] = [];
    private _xyRange:XYRange;

    public get xRange():Range
    {
        return this._xyRange.xRange;
    }   
    
     public get yRange():Range
    {
        return this._xyRange.yRange;
    }
    /**
     * Smallest x value of the Polygon.
     */
    public get minX():number
    {
        return this._xyRange.xRange.min;
    }  
    /**
     * Largets x value of the Polygon.
     */ 
    public get maxX():number
    {
        return this._xyRange.xRange.max;
    }  
    /**
     * Smallest y value of the Polygon.
     */
    public get minY():number
    {
        return this._xyRange.yRange.min;
    }
    /**
     * Largets y value of the Polygon.
     */ 
    public get maxY():number
    {
        return this._xyRange.yRange.max;
    }
    /**
     * The current vertices of the Polygon.
     */
    public get vertices():Vector2D[]
    {
        return this._vertices;
    }
    /**
     * The total number of vertices in the Polygon.
     */
    public get count():number
    {
        return this._vertices.length;
    }
    /**
     * Creates a new instance of Polygon.
     * @param fillStyle Color used as the CanvasRenderingContext2D.fillStyle.
     * @param strokeStyle Color used as the CanvasRenderingContext2D.strokeStyle.
     */
    constructor(fillStyle:Color = Color.black, strokeStyle:Color = Color.white)
    {
        super(null, null, fillStyle, strokeStyle);
        this._xyRange = new XYRange(0, 0, 0, 0);
        this.update();
    }
    /**
     * Updates the Polygon's internal properties.
     */
    public update():void
    {
        this._xyRange.recalculate(this._vertices);
    }
    /**
     * Renders the Polygon.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    public render(ctx:CanvasRenderingContext2D):void
    {
        this.beginRender(ctx);

        Polygon.renderVertices(ctx, this._vertices);
        
        this.endRender(ctx);
    }
    /**
     * Adds a new vertex to the Polygon.
     * @param vector The vector to add.
     */
    public addVertex(vector:Vector2D):void
    {
        this._vertices.push(vector);
        this.update();
    }
    /**
     * Removes all vertices of the Polygon.
     */
    public clearVertices():void
    {
        this._vertices = [];
        this.update();
    }
    /**
     * Gets the vertex at the specified index.
     * @param index The index of the verted to get.
     * Returns the vertex.
     */
    public vertexAt(index:number):Vector2D
    {
        return this._vertices[index];
    }
    /**
     * Checks if a position is inside the Polygon.
     * @param vector The positon to check against.
     * Returns true if the position is inside the Polygon.
     */
    public intersects(vector:Vector2D):boolean
    {
        return Polygon.intersects(this._vertices, vector);
    }

    /**
     * Warning! This is a semi-expensive operation.
     * Attempts to generate a random position inside the Polygon.
     * @param padding Padding to apply to the random position generation.
     * Returns the random position if it can be generated. Returns null otherwise.
     */
    public getRandomPosition(padding?:IPadding):Vector2D
    {
        let xYRange = this._xyRange.withPadding(padding);

        return Polygon._getRandomPosition(xYRange.xRange, xYRange.yRange, this._vertices, padding);
    }

    public toString():string
    {
        return '(' + this._vertices.join(', ') + ')';
    }
    /**
     * Warning! This is a semi-expensive operation.
     * Attempts to generate a random position inside a Polygon.
     * @param xRange Range of the x-axis.
     * @param yRang Range of the y-axis.
     * @param vertices The vertices that form the polygon.
     * @param padding Padding to apply to the random position generation.
     * Returns the random position if it can be generated. Returns null otherwise.
     */
    protected static _getRandomPosition(xRange:Range, yRange:Range, vertices:Vector2D[], padding?:IPadding):Vector2D
    {
        let result:Vector2D;
        let maxAttempts = 1000;
        let attempts = 0;
        while(true)
        {
            result = new Vector2D(Random.next(xRange.min, xRange.max + 1), Random.next(yRange.min, yRange.max + 1));

            if (Polygon.intersects(vertices, result))
            {
                return result;
            }
            else
            {
                attempts++;

                if (attempts === maxAttempts)
                {
                    break;
                }
            }
        }   
        
        return null;
    }
    /**
     * Checks if a position is inside a Polygon formed of an array of vertices (Vector2D[]).
     * @param vertices The positions to from the Polygon from.
     * @param vector The positon to check against.
     * Returns true if the position is inside the Polygon.
     */
    public static intersects(vertices:Vector2D[], vector:Vector2D):boolean
    {
        return polygon_intersects(vertices, vector);
    }
    /**
     * Warning! This is a semi-expensive operation.
     * Attempts to generate a random position inside a Polygon.
     * @param vertices The vertices that form the polygon.
     * @param padding Padding to apply to the random position generation.
     * Returns the random position if it can be generated. Returns null otherwise.
     */
    public static getRandomPosition(vertices:Vector2D[], padding?: IPadding):Vector2D
    {
        let xyRange = XYRange.from(vertices);

        let xRange = new Range(padding !== undefined ? xyRange.minX + padding.left : xyRange.minX, padding !== undefined ? xyRange.maxX - padding.right : xyRange.maxX);
        let yRange = new Range(padding !== undefined ? xyRange.minY + padding.top : xyRange.minY, padding !== undefined ? xyRange.maxY - padding.bottom : xyRange.maxY);

        return Polygon._getRandomPosition(xRange, yRange, vertices, padding);
    }
    /**
     * Renders a polygon from an array of vertices (Vector2D[]).
     * @param ctx CanvasRenderingContext2D used to render.
     * @param vertices The vertices used to form the polygon.
     */
    public static renderVertices(ctx:CanvasRenderingContext2D, vertices:Vector2D[]):void
    {
        var vertex;

        for(var i = 0; i < vertices.length; i++)
        {
            vertex = vertices[i];

            if (i == 0)
            {
                ctx.moveTo(vertex.x, vertex.y);
            }
            else
            {
                ctx.lineTo(vertex.x, vertex.y);
            }
        }
    }
}

import {Renderable, IRenderable} from './renderable';
import Vector2D from './vector2d';
import Size from './size';
import Color from './color';
import Padding, {IPadding} from './padding';
import {min, max} from '../helpers/math';
import Random from '../random';
import Range from './range';

/**
 * Represents a polygon with n number of vertices.
 */
export default class Polygon extends Renderable implements IRenderable
{
    private _vertices:Vector2D[] = [];
    private _minX:number = 0;
    private _maxX:number = 0;
    private _minY:number = 0;
    private _maxY:number = 0;

    public get minX():number
    {
        return this._minX;
    }    
    public get maxX():number
    {
        return this._maxX;
    }    
    public get minY():number
    {
        return this._minY;
    }
    public get maxY():number
    {
        return this._maxY;
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
    }

    public update():void
    {
        this._minX = min<Vector2D>(vector => vector.x, this._vertices);
        this._maxX = max<Vector2D>(vector => vector.x, this._vertices);        
        
        this._minY = min<Vector2D>(vector => vector.y, this._vertices);
        this._maxY = max<Vector2D>(vector => vector.y, this._vertices);
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
        let xRange = new Range(padding !== undefined ? this._minX + padding.left : this._minX, padding !== undefined ? this._maxX - padding.right : this._maxX);
        let yRange = new Range(padding !== undefined ? this._minY + padding.top : this._minY, padding !== undefined ? this._maxY - padding.bottom : this._maxY);

        return Polygon._getRandomPosition(xRange, yRange, this._vertices, padding);
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
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        var x = vector.x, y = vector.y;
        
        var inside = false;

        for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++)
        {
            var xi = vertices[i].x, yi = vertices[i].y;
            var xj = vertices[j].x, yj = vertices[j].y;
            
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
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
        let minX = min<Vector2D>(vector => vector.x, vertices);
        let maxX = max<Vector2D>(vector => vector.x, vertices);        
        let minY = min<Vector2D>(vector => vector.y, vertices);
        let maxY = max<Vector2D>(vector => vector.y, vertices);

        let xRange = new Range(padding !== undefined ? minX + padding.left : minX, padding !== undefined ? maxX - padding.right : maxX);
        let yRange = new Range(padding !== undefined ? minY + padding.top : minY, padding !== undefined ? maxY - padding.bottom : maxY);

        return Polygon._getRandomPosition(xRange, yRange, vertices, padding);
    }

    public static intersects2(vertices:Vector2D[], vector:Vector2D):boolean
    {
        // From http://stackoverflow.com/a/14998816/4438600
        
        let result = false;
        let j = vertices.length - 1;

        for (let i = 0; i < vertices.length; i++)
        {
            if (vertices[i].y < vector.y && vertices[j].y >= vector.y || vertices[j].y < vector.y && vertices[i].y >= vector.y)
            {
                if (vertices[i].x + (vector.y - vertices[i].y) / (vertices[j].y - vertices[i].y) * (vertices[j].x - vertices[i].x) < vector.x)
                {
                    result = !result;
                }
            }
            j = i;
        }
        return result;
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


import Vector2D from '../system/drawing/vector2d';

export default class GameEntity
{
    public position:Vector2D;
    public velocity:Vector2D;

    public gravity:Vector2D;

    constructor(x:number, y:number)
    {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
    }

    public update()
    {
        this.position.add(this.velocity);
        this.velocity.subtract(this.gravity);
    }
}
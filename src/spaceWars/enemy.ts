
import Player from '../spaceWars/player';
import Vector2D from '../system/component/vector2d';
import Circle from '../system/drawing/circle';
import Color from '../system/component/color';
import Rectangle from '../system/drawing/rectangle';
import Padding from '../system/component/padding';
import SmoothedMovement from '../system/engine/simulation/smoothedMovement';

export default class Enemy extends Player
{
    public targetPosition:Vector2D = undefined;
    public velocity:Vector2D = new Vector2D(0, 0);

    private _targetPosCircle:Circle;
    private _randomPosPadding:Padding = new Padding(100);
    protected _movement:SmoothedMovement;

    public projectileDamage:number = 250;

    constructor(x:number, y:number, bounds:Rectangle, hitpoints:number)
    {
        super(x, y, bounds, hitpoints);
        this._targetPosCircle = new Circle(0, 0, 5, Color.yellow, Color.white);

        this._movement.getNewTargetPosition = this._getNewTargetPosition;
        this._movement.updateTargetPosition();
    }
    
    protected _getNewTargetPosition = ():Vector2D => 
    {
        let pos = this.bounds.getRandomPosition(this._randomPosPadding);
        this._targetPosCircle.position = pos;

        return pos;
    }

    public render(ctx:CanvasRenderingContext2D):void
    {
        super.render(ctx);

        //this._targetPosCircle.render(ctx);
    }

    public update()
    {
        super.update();
    }
}

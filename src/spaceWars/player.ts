import Color from '../system/component/color';
import Rectangle from '../system/drawing/rectangle';
import Vector2D from '../system/component/vector2d';
import RegularPolygon from '../system/drawing/regularPolygon';
import Circle from '../system/drawing/circle';
import Projectile from '../spaceWars/projectile';
import {rotateTowards, normalizeRadians, map} from '../system/helpers/math';
import {array_remove} from '../system/helpers/array';
import SmoothedMovement from '../system/engine/simulation/SmoothedMovement';
import Hitpoints from '../system/engine/simulation/health/health';
import HealthBar, {IHealthBarOwner} from '../system/drawing/healthBar/healthBar';

import {IProjectileOwner, IProjectileTarget} from '../system/engine/simulation/projectile/projectileSystem';

import KickerMessageManager from '../system/drawing/kickerMessage/kickerMessageManager';
import KickerMessage, {IKickerMessageOwner} from '../system/drawing/kickerMessage/kickerMessage';

export default class Player implements IProjectileOwner, IProjectileTarget, IKickerMessageOwner, IHealthBarOwner
{
    private _hpBar:HealthBar;
    private _messages:KickerMessageManager = new KickerMessageManager();
    private _triangle:RegularPolygon;
    private _circle:Circle;
    
    private _position:Vector2D;
    private _rotation:number = 0;

    private _radius:number = 50;

    public projectiles:Projectile[] = [];
    protected _movement:SmoothedMovement;

    public bounds:Rectangle = new Rectangle(0, 0, 0, 0);
    public aimZoneRadius:number = 125;
    public aimZoneEnabled:boolean = false;
    private _aimZoneCircle:Circle;
    public mouseInAimZone:boolean = false;
    public isAimingMode:boolean = false;

    public projectileDamage:number = 100;
    public hitpoints:Hitpoints;

    private _targetPosition:Vector2D;

    public set targetPosition(value:Vector2D)
    {
        this._targetPosition = value;
        this._movement.updateTargetPosition();
        //this._movement.targetPosition = this._targetPosition;
    }

    public get targetPosition():Vector2D
    {
        return this._targetPosition;
    }
    public get radius():number
    {
        return this._radius;
    }

    public set radius(value:number)
    {
        this._radius = value;
        this._update();
    }

    public get rotation():number
    {
        return this._rotation;
    }

    public set rotation(value:number)
    {
        this._rotation = value;
        this._update();
    }

    public get position():Vector2D
    {
        return this._position;
    }

    public set position(value:Vector2D)
    {
        if (this._position != null)
        {
            this._position.onChanged.unsubscribe(this.positionOnChanged);
        }

        this._position = value;

        this._position.onChanged.subscribe(this.positionOnChanged);
        this._update();
    }

    private _fillStyle:Color = new Color(255, 255, 255, 1);
    public get fillStyle():Color
    {
        return this._fillStyle;
    }
    public set fillStyle(value:Color)
    {
        this._fillStyle = value;
        this._updateStyles();
    }   
    
    private _strokeStyle:Color = new Color(255, 0, 0, 1);
    public get strokeStyle():Color
    {
        return this._strokeStyle;
    }
    public set strokeStyle(value:Color)
    {
        this._strokeStyle = value;
        this._updateStyles();
    }

    constructor(x:number, y:number, bounds:Rectangle, hitpoints:number)
    {
        this._triangle = new RegularPolygon(x, y, this.radius, 3, this._fillStyle, this._strokeStyle);
        this._circle = new Circle(x, y, 5, Color.red, Color.white);
        this._aimZoneCircle = new Circle(x, y, this.aimZoneRadius, Color.black, new Color(255, 255, 255, 0.1));
        this._aimZoneCircle.lineDash = [2, 16];
        this._aimZoneCircle.fill = false;

        this.position = new Vector2D(x, y);
        this.bounds = bounds;
        this._movement = new SmoothedMovement(this.position);
        this._movement.getNewTargetPosition = this._getNewTargetPosition;
        this.targetPosition = new Vector2D(x, y);

        this.hitpoints = new Hitpoints(hitpoints, hitpoints);
        this.hitpoints.onChanged.subscribe(this.hitpointsOnChanged);
        this._hpBar = new HealthBar(100, 10, this, 0, -100);
    }

    protected hitpointsOnChanged = (sender:Hitpoints, oldValue:number, newValue:number) =>
    {
        let alpha = map(this.hitpoints.value, 0, this.hitpoints.max, 0.1, 1);
        this.fillStyle.alpha = alpha;
        this.strokeStyle.alpha = alpha;
        this._circle.fillStyle.alpha = alpha;
        this._circle.strokeStyle.alpha = alpha;

        var diff = newValue - oldValue;

        let message = new KickerMessage(this, `${diff} HP`);
        message.text.fillStyle = (diff < 0 ? Color.red : Color.green);
        message.text.stroke = false;

       this._messages.add(message);
    }
    
    protected _getNewTargetPosition = ():Vector2D => 
    {
        return new Vector2D(this.targetPosition);
    }

    private positionOnChanged = (sender:any):void =>
    {
        this._update();
    }

    private _updateStyles()
    {
        this._triangle.fillStyle = this._fillStyle;
        this._triangle.strokeStyle = this._strokeStyle;
    }

    private _update()
    {
        this._triangle.position = this._position;
        this._triangle.rotation = this._rotation;
        this._aimZoneCircle.position = this._position;
        this._circle.position = this._position.getOffsetTowardsAngle(this.radius, this._rotation);
    }

    public render(ctx:CanvasRenderingContext2D):void
    {
        if (this.aimZoneEnabled && this.mouseInAimZone)
        {
            this._aimZoneCircle.render(ctx);
        }
        let rotation = this._triangle.rotation;
        this._triangle.rotation = normalizeRadians(this._triangle.rotation + Math.PI);
        this._triangle.render(ctx);
        this._triangle.rotation = rotation;
        this._circle.render(ctx);

        var projectile:Projectile;

        for(var i = 0; i < this.projectiles.length; i++)
        {
            projectile = this.projectiles[i];
            projectile.render(ctx);
        }

        this._hpBar.render(ctx);
        this._messages.render(ctx);
    }

    public intersects(position:Vector2D):boolean
    {
        return this._triangle.intersects(position);
    }

    public shoot():void
    {
        var projectile = new Projectile(this._circle.x, this._circle.y);
        projectile.damage = this.projectileDamage;
        
        projectile.velocity = this._circle.position.subtract(this._circle.position.getOffsetTowardsAngle(-4, this._rotation));

        this.projectiles.push(projectile);
    }

    public update()
    {
        this._messages.update();
        this._hpBar.update();

        if (this.mouseInAimZone)
        {
            this._movement.updateStartPosition();
        }

        this._movement.update();
        this.position.set(this._movement.position);

        var projectile:Projectile;

        for(var i = this.projectiles.length - 1; i >= 0; i--)
        {
            projectile = this.projectiles[i];
            projectile.position = projectile.position.add(projectile.velocity);
 
            if (!this.bounds.intersects(projectile.position))
            {
                this.projectiles.splice(i, 1);
            }
        }
    }

    public removeProjectile(projectile:Projectile):void
    {
        array_remove(this.projectiles, projectile);
    }

    public isHitByProjectile(projectile:Projectile):boolean
    {
        return this.intersects(projectile.position);
    }
}
import Vector2D from '../../drawing/vector2D';
import {IProjectile, IProjectileOwner, IProjectileTarget} from 'projectileSystem';
import ProjectileSystem from 'projectileSystem';
import ProjectileSystemResult from 'projectileSystemResult';

export default class ProjectileSystemEntry
{
    private _owner:IProjectileOwner;
    private _targets:IProjectileTarget[];

    public get owner():IProjectileOwner
    {
        return this._owner;
    }

    constructor(owner:IProjectileOwner, target:IProjectileTarget)
    constructor(owner:IProjectileOwner, targets:IProjectileTarget[])
    constructor(owner:IProjectileOwner, targets:IProjectileTarget[]|IProjectileTarget)
    {
        this._owner = owner;
        this._targets = (targets instanceof Array ? targets : [targets]);
    }

    public update(system:ProjectileSystem):ProjectileSystemResult[]
    {
        let result:ProjectileSystemResult[] = [];
        let projectile:IProjectile;
        let target:IProjectileTarget;

        for(let i = this._owner.projectiles.length - 1; i >= 0; i--)
        {
            projectile = this._owner.projectiles[i];

            for (let j = 0; j < this._targets.length; j++)
            {
                target = this._targets[j];
                if (target.isHitByProjectile(projectile))
                {
                    target.hitpoints.subtract(projectile.damage);

                    let resultItem = new ProjectileSystemResult(this._owner, target, projectile);
                    result.push(resultItem);

                    this._owner.removeProjectile(projectile);
                    system.onProjectileHit.trigger(system, resultItem);
                }
            }
        }

        return result;
    }
}

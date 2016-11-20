import Vector2D from '../../../component/vector2D';
import {IProjectile, IProjectileOwner, IProjectileTarget} from './projectileSystem';
import ProjectileSystem from './projectileSystem';
import ProjectileSystemResult from './projectileSystemResult';

/**
 * Represents a ProjectileSystem entry.
 */
export default class ProjectileSystemEntry
{
    private _owner:IProjectileOwner;
    private _targets:IProjectileTarget[];

    /**
     * The owner of the ProjectileSystemEntry.
     */
    public get owner():IProjectileOwner
    {
        return this._owner;
    }
    /**
     * Creates a new instance of ProjectileSystemEntry.
     * @param owner The owner of the projectiles.
     * @param target The target of the projectiles.
     */
    constructor(owner:IProjectileOwner, target:IProjectileTarget)
    /**
     * Creates a new instance of ProjectileSystemEntry.
     * @param owner The owner of the projectiles.
     * @param targets The targets of the projectiles.
     */
    constructor(owner:IProjectileOwner, targets:IProjectileTarget[])
    constructor(owner:IProjectileOwner, targets:IProjectileTarget[]|IProjectileTarget)
    {
        this._owner = owner;
        this._targets = (targets instanceof Array ? targets : [targets]);
    }
    /**
     * Updates the ProjectileSystemEntry.
     * Returns the results.
     */
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

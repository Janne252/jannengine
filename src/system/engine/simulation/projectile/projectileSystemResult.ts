import {IProjectile, IProjectileOwner, IProjectileTarget} from './projectileSystem';

/**
 * Represents a ProjectileSystem result, where a projectile hit a target.
 */
export default class ProjectileSystemResult
{
    /**
     * The owner of the projectile that hit a target.
     */
    public owner:IProjectileOwner;
    /**
     * The target that was hit.
     */
    public target:IProjectileTarget;
    /**
     * The projectile that hit the target.
     */
    public projectile:IProjectile;
    /**
     * Whether or not the target's hitpoints were drained to the minimum value.
     */
    public died:boolean;

    /**
     * Creates a new instance of ProjectileSystemResult.
     * @param owner The owner of the projectile that hit a target.
     * @param target The target that was hit.
     * @param projectile The projectile that hit the target.
     */
    constructor(owner:IProjectileOwner, target:IProjectileTarget, projectile:IProjectile)
    {
        this.owner = owner;
        this.target = target;
        this.projectile = projectile;

        this.died = this.target.hitpoints.isDead;
    }
}
import {IProjectile, IProjectileOwner, IProjectileTarget} from 'projectileSystem';

export default class ProjectileSystemResult
{
    public owner:IProjectileOwner;
    public target:IProjectileTarget;
    public projectile:IProjectile;
    public died:boolean;

    constructor(owner:IProjectileOwner, target:IProjectileTarget, projectile:IProjectile)
    {
        this.owner = owner;
        this.target = target;
        this.projectile = projectile;

        this.died = this.target.hitpoints.isDead;
    }
}
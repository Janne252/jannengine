import Vector2D from '../../../component/vector2D';
import Hitpoints from '../hitpoint/hitpoints';
import ProjectileSystemEntry from './projectileSystemEntry';
import ProjectileSystemResult from './projectileSystemResult';
import EventHandler from '../../../component/event/eventHandler';
import {array_remove} from '../../../helpers/array';

/**
 * Represents a system where IProjectileOwners target IProjectileTargets.
 * Automatically removes projectiles that hit their targets and reduces the hitpoints of the target.
 * All IProjectile hits are reported.
 */
export default class ProjectileSystem
{
    private _entries:ProjectileSystemEntry[] = [];
    private _onProjectileHit = new EventHandler<ProjectileOnHitCallback>();

    /**
     * EventHandler triggered every time a projectile hits a target.
     */
    public get onProjectileHit():EventHandler<ProjectileOnHitCallback>
    {
        return this._onProjectileHit;
    }
    
    /**
     * Creates a new instance of ProjectileSystem.
     */
    constructor()
    {

    }
    /**
     * Checks all projectiles and reports the results.
     * Returns an array of ProjectileSystemResult, one per projectile hit.
     */
    public update():ProjectileSystemResult[]
    {
        let result:ProjectileSystemResult[] = [];

        let entry:ProjectileSystemEntry;

        for(let i = 0; i < this._entries.length; i++)
        {
            entry = this._entries[i];

            result = result.concat(entry.update(this));
        }

        return result;
    }
    /**
     * Adds a new ProjectileSystemEntry to the system.
     * @param entry The entry to add.
     */
    public add(entry:ProjectileSystemEntry):void
    {
        this._entries.push(entry);
    }
    /**
     * Removes a ProjectileSystemEntry from the system.
     * @param entry The entry to remove.
     */
    public remove(entry:ProjectileSystemEntry):void
    {
        array_remove(this._entries, entry);
    }
    /**
     * Removes ProjectileSystemEntries from the system based on the owner.
     * @param owner The owner of ProjectileSystemEntries to remove.
     */
    public removeByOwner(owner:IProjectileOwner):void
    {
        let entry:ProjectileSystemEntry;

        for(let i = this._entries.length - 1; i >= 0; i--)
        {
            entry = this._entries[i];
            if (entry.owner === owner)
            {
                this.remove(entry);
            }
        }
    }
}

/**
 * Required implementation of an owner of a projectile.
 */
export interface IProjectileOwner
{
    /**
     * Array containing the projectiles.
     */
    projectiles:IProjectile[];
    /**
     * Removes a projectile from the owner.
     * @param projectile The projectile to remove.
     */
    removeProjectile(projectile:IProjectile):void;
}
/**
 * Required implementation of a projectile.
 */
export interface IProjectile
{
    /**
     * The position of the projectile.
     */
    position:Vector2D;
    /**
     * How much damage the projectile inflicts.
     */
    damage:number;
}
/**
 * Required implementation of a projectile target.
 */
export interface IProjectileTarget
{
    /**
     * Checks if a projectile hits a target.
     * @param projectile The projectile to check.
     * Returns true if the projectile hits the target.
     */
    isHitByProjectile(projectile:IProjectile):boolean;
    /**
     * Hitpoints of the projectile target.
     */
    hitpoints:Hitpoints;
}
/**
 * ProjectileSystem.onProjectileHit callback type.
 */
export interface ProjectileOnHitCallback
{
    /**
     * @param sender The sender of the event.
     * @param result The projectileSystemResult.
     */
    (sender:ProjectileSystem, result:ProjectileSystemResult):void;
}
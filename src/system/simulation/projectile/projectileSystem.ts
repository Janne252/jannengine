import Vector2D from '../../drawing/vector2D';
import Hitpoints from '../../simulation/hitpoints/hitpoints';
import ProjectileSystemEntry from 'projectileSystemEntry';
import ProjectileSystemResult from 'projectileSystemResult';

import EventHandler from '../../event/EventHandler';

import {array_remove} from '../../helpers/array';

export default class ProjectileSystem
{
    private _entries:ProjectileSystemEntry[] = [];

    private _onProjectileHit = new EventHandler<ProjectileOnHitCallback>();
    public get onProjectileHit():EventHandler<ProjectileOnHitCallback>
    {
        return this._onProjectileHit;
    }
    
    constructor()
    {

    }

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

    public add(entry:ProjectileSystemEntry):void
    {
        this._entries.push(entry);
    }

    public remove(entry:ProjectileSystemEntry):void
    {
        array_remove(this._entries, entry);
    }

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

export interface IProjectileOwner
{
    projectiles:IProjectile[];
    removeProjectile(projectile:IProjectile):void;
}

export interface IProjectile
{
    position:Vector2D;
    damage:number;
}

export interface IProjectileTarget
{
    position:Vector2D;
    isHitByProjectile(projectile:IProjectile):boolean;
    hitpoints:Hitpoints;
}


export interface ProjectileOnHitCallback
{
    (sender:ProjectileSystem, result:ProjectileSystemResult):void;
}
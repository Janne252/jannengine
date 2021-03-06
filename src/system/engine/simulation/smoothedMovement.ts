import Vector2D from '../../component/vector2D';
import SmoothedMovementSettings from '../simulation/smoothedMovementSettings';
import {clamp} from '../../helpers/math';

/**
 * Represents movement simulation between points.
 */
export default class SmoothedMovement
{
    /**
     * The settings used to control the movement.
     */
    public settings:SmoothedMovementSettings;
    /**
     * Current velocity.
     */
    public velocity:Vector2D;
    /**
     * Current position.
     */
    public position:Vector2D;
    /**
     * Current movement starting position.
     */
    public startPosition:Vector2D;
    /**
     * Current movement target position.
     */
    public targetPosition:Vector2D;
    /**
     *  The arrow function used to get a new target once the current target position has been reached.
     */
    public getNewTargetPosition:TargetPositionProvider;
    /**
     * Creates a new instance of SmoothedMovement.
     * @param position The current position.
     */
    constructor(position:Vector2D)
    {
        this.settings = new SmoothedMovementSettings();
        this.velocity = new Vector2D(0, 0);
        this.startPosition = new Vector2D(position);
        this.position = new Vector2D(position);
    }

    /**
     * Updates the target position.
     */
    public updateTargetPosition():boolean
    {
        let newPos = this.getNewTargetPosition();

        if (newPos.equals(this.targetPosition))
        {
            return false;
        }

        this._setTargetPosition(newPos);

        return true;
    }
    /**
     * Updates the starting position.
     */
    public updateStartPosition():void
    {
        this.startPosition.set(this.position);
    }
    /**
     * Sets the new target position.
     */
    private _setTargetPosition(position:Vector2D):void
    {
        if (!position.equals(this.targetPosition))
        {
            this.targetPosition = position;
        }
    }
    /**
     * Updates the SmoothedMovement.
     */
    public update = () => 
    {
        let settings = this.settings;

        let distanceToStart = this.startPosition.distanceTo(this.position);
        let distanceToTarget = this.targetPosition !== undefined ? this.targetPosition.distanceTo(this.position) : settings.triggerDistance;

        if (distanceToTarget <= settings.triggerDistance)
        {
            let success = this.updateTargetPosition();

            if (!success)
            {
                return;
            }

            this.updateStartPosition();
        }

        // Laske suunta vasta, kun ollaan varmoja siitä, että meillä on kohdepiste.
        let directionToTarget = this.targetPosition.subtract(this.position).normalized();

        if (distanceToStart <= distanceToTarget)
        {
            // Etäisyys alkupisteeseen clampattuna etäisyyteen johon nopeutus loppuu.
            let clampedDistance = clamp(distanceToStart, 0, settings.accelerationDistance);
            // Eksponentti kontrolloi käyrää
            let desiredVelocity = Math.max(Math.pow(clampedDistance / settings.accelerationDistance, settings.accelerationExponent) * settings.maxVelocity, 0.1);
            this.velocity = directionToTarget.multiply(desiredVelocity);
        }
        else
        {
            // Etäisyys loppupisteeseen clampattuna etäisyyteen josta hidastus alkaa.
            let clampedDistance = clamp(distanceToTarget, 0, settings.decelerationDistance);
            // Eksponentti kontrolloi käyrää
            let desiredVelocity = Math.pow(clampedDistance / settings.decelerationDistance, settings.decelerationExponent) * settings.maxVelocity;
            this.velocity = directionToTarget.multiply(desiredVelocity);
        }

        let velocityMagnitude = this.velocity.length();

        if(velocityMagnitude > settings.maxVelocity)
        {
            this.velocity = this.velocity.normalized().multiply(settings.maxVelocity);
        }

        this.position = this.position.add(this.velocity);
    }
}

/**
 * Required implementation of SmoothedMovement.getNewTargetPosition.
 */
export interface TargetPositionProvider
{
    ():Vector2D;
}
/**
 * Represents settings for SmoothedMovement.
 */
export default class SmoothedMovementSettings
{
    /**
     * Distance to target which after the velocity no longer attempts to increase.
     */
    public accelerationDistance:number = 50.0;
    /**
     * Distance to target which after the velocity decreases.
     */
    public decelerationDistance:number = 50.0;
    /**
     * Acceleration exponent.
     */
    public accelerationExponent:number = 0.8;
    /**
     * Deceleration exponent.
     */
    public decelerationExponent:number = 0.8;
    /**
     * Distance to target that is considered landing there.
     */
    public triggerDistance:number = 1;
    /**
     * Maximum movement speed, determined by update rate.
     */
    public maxVelocity:number = 1.5;
    /**
     * Creates a new instance of SmoothedMovementSettings.
     * @param maxVelocity Maximum movement speed, determined by update rate.
     * @param accelerationDistance Distance to target which after the velocity no longer attempts to increase.
     * @param decelerationDistance Distance to target which after the velocity decreases.
     * @param triggerDistance Distance to target that is considered landing there.
     * @param accelerationExponent Acceleration exponent.
     * @param decelerationExponent Deceleration exponent.
     */
    constructor(
        maxVelocity:number = 1.5, 
        accelerationDistance:number = 50.0, 
        decelerationDistance:number = 50.0,
        triggerDistance:number = 1,
        accelerationExponent:number = 0.8,
        decelerationExponent:number = 0.8
    )
    {
        this.maxVelocity = maxVelocity;
        this.accelerationDistance = accelerationDistance;
        this.decelerationDistance = decelerationDistance;
        this.triggerDistance = triggerDistance;
        this.accelerationExponent = accelerationExponent;
        this.decelerationExponent = decelerationExponent;
    }
}
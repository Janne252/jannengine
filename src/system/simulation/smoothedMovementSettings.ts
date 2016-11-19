
export default class SmoothedMovementSettings
{
    public accelerationDistance:number = 50.0;
    public decelerationDistance:number = 50.0;
    public accelerationExponent:number = 0.8;
    public decelerationExponent:number = 0.8;
    public triggerDistance:number = 1;

    public maxVelocity:number = 1.5;

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
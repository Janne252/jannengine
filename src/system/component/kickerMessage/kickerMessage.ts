import Vector2D from '../../component/vector2d';
import Size from '../../component/size';
import Color from '../../component/color';
import Text from '../../drawing/text';
import {map} from '../../helpers/math';

/**
 * Represents a text label that quickly disappears by fading its transparency and raising up.
 */
export default class KickerMessage implements IKickerMessage
{
    private _lifeTicks:number = 0;

    /**
     * The actual text that is rendered.
     */
    public text:Text;
    /**
     * Initial and current velocity of the KickerMessage.
     */
    public velocity:Vector2D;
    /**
     * Vector that is added to the velocity on each update call.
     */
    public velocityStep:Vector2D;
    /**
     * How many update calls the KickerMessage stays visible.
     */
    public lifeTime:number;
    /**
     * Owner of the KickerMessage that is used to track the position.
     */
    public owner:IKickerMessageOwner;
    /**
     * Whether or not the KickerMessage position should follow the owner.
     */
    public followOwner:boolean = true;
    
    /**
     * Whether or not the KickerMessage lifeTime has been reached.
     */
    public get isFinished():boolean
    {
        return this._lifeTicks >= this.lifeTime;
    }
    /**
     * Creates a new instance of KickerMessage.
     * @param owner The owner of the KickerMessage that is used to track the position.
     * @param text The text that is displayed.
     */
    constructor(owner:IKickerMessageOwner, text:string)
    {
        this.owner = owner;
        this.text = new Text(this.owner.position.x, this.owner.position.y, text);
        this.velocity = new Vector2D(0, -1);
        this.velocityStep = new Vector2D(0, -1);
        this.lifeTime = 100;
    }
    /**
     * Renders the KickerMessage.
     * @param ctx The CanvasRenderingContext2D used to render the KickerMessage.
     */
    public render(ctx:CanvasRenderingContext2D):void
    {
        this.text.render(ctx);
    }
    /**
     * Updates the KickerMessage.
     */
    public update():void
    {
        if (this.followOwner)
        {
            this.text.position = this.owner.position.add(this.velocity);
        }
        else
        {
            this.text.position = this.text.position.add(this.velocity);
        }
        this.velocity = this.velocity.add(this.velocityStep);

        this._lifeTicks++;
        let alpha = map(this._lifeTicks, 0, this.lifeTime, 1, 0);
        this.text.fillStyle.alpha = alpha;
        this.text.strokeStyle.alpha = alpha;
    }
}

export interface IKickerMessage
{
    /**
     * Whether or not the KickerMessage lifeTime has been reached.
     */
    isFinished:boolean;
    /**
     * Updates the KickerMessage.
     */
    update():void;
    /**
     * Renders the KickerMessage.
     * @param ctx The CanvasRenderingContext2D context used to render the KickerMessage.
     */
    render(ctx:CanvasRenderingContext2D):void;
    /**
     * Owner of the KickerMessage that is used to track the position.
     */
    owner:IKickerMessageOwner;
}

/**
 * IKickerMessage.owner type.
 */
export interface IKickerMessageOwner
{
    /**
     * Position of the owner.
     */
    position:Vector2D;
}
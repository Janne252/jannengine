import {IKickerMessage} from './kickerMessage';
import {array_remove} from '../../helpers/array';

/**
 * Represents a manager that takes care of IKickerMessages.
 */
export default class KickerMessageManager
{
    private _messages:IKickerMessage[] = [];

    /**
     * Creates a new instance of KickerMessageManager.
     */
    constructor()
    {

    }
    /**
     * Adds a new message to the KickerMessageManager.
     * @param message The message to add.
     */
    public add(message:IKickerMessage):void
    {
        this._messages.push(message);
    }
    /**
     * Updates the KickerMessageManager.
     */
    public update():void
    {
        let message:IKickerMessage;

        for(let i = this._messages.length - 1; i >= 0; i--)
        {   
            message = this._messages[i];
            message.update();

            if (message.isFinished)
            {
                array_remove(this._messages, message);
            }
        }
    }
    /**
     * Renders the KickerMessageManager.
     * @param ctx CanvasRenderingContext2D used to render.
     */
    public render(ctx:CanvasRenderingContext2D):void
    {
        let message:IKickerMessage;

        for(let i = 0; i < this._messages.length; i++)
        {
            message = this._messages[i];

            message.render(ctx);
        }
    }
}
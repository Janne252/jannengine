import EventHandlerCallbackBind from './eventHandlerCallbackBind';

/**
 * Represents a collection of subscribed listeners that all get notified when the EventHandler gets trigger()'d.
 */
export default class EventHandler<CallbackType>
{
    private _binds:EventHandlerCallbackBind<CallbackType>[] = [];

    /**
     * count of subscribed listers.
     */
    public get count():number
    {
        return this._binds.length;
    }

    /**
     * Creates a new instance of EventHandler.
     */
    constructor()
    {

    }

    /**
     * Subscribe a new listener. Handler cannot be a method! Handler must be a property that is an arrow function, 
     * e.g. myHanlder = (sender:any):void => {}
     * @param owner The owner of the handler method.
     * @param handler Handler to add as a new subscriber.
     */
    public subscribe(handler:CallbackType):void
    {
        this._binds.push(new EventHandlerCallbackBind(handler));
    }

    /**
     * Unsubscribes a handler. Handler cannot be a method! Handler must be a property that is an arrow function, 
     * e.g. myHanlder = (sender:any):void => {}
     * @param handler The handler to unsubscribe.
     */
    public unsubscribe(handler:CallbackType):void
    {
        var bind:EventHandlerCallbackBind<CallbackType>;

        for(var i = 0; i < this._binds.length; i++)
        {
            bind = this._binds[i];

            if (handler == bind.sourceFunction)
            {
                this._binds.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Calls all subscribed handlers with the passed arguments.
     * @param sender Sender of the trigger call that is passed as the sender.
     * @param ...args Additional parameters to pass.
     */
    public trigger(sender:any, ...args:any[]):void
    {
        var bind:EventHandlerCallbackBind<CallbackType>;

        for(var i = 0; i < this.count; i++)
        {
            bind = this._binds[i];

            (<EventHandlerCallbackBind<any>>bind).handler(sender, ...args);
        }
    }   
}
/**
 * Represents a singular binded handler function.
 */
export default class EventHandlerCallbackBind<CallbackType>
{
    /**
     * source function that the event callback is bound to.
     */
    public sourceFunction:CallbackType;

    /**
     * The actually bound handler. Has to be an arrow function.
     */
    public handler:CallbackType;

    /**
     * Creates a new instance of EventHandlerCallbackBind.
     * Handler cannot be a method! Handler must be a property that is an arrow function, e.g. myHanlder = (sender:any):void => {}
     * @param handler Handler function.
     */
    constructor(handler:CallbackType)
    {
        this.sourceFunction = handler;
        this.handler = handler;
    }
}
import EventHandler from './event/eventHandler';

export class Animal
{
    protected _name:string = 'Animal';

    private _onNameChanged = new EventHandler<TestClassOnChangedCallback>();
    public get onNameChanged():EventHandler<TestClassOnChangedCallback>
    {
        return this._onNameChanged;
    }

    public get name():string
    {
        return this._name;
    }

    public set name(value:string)
    {
        this._name = value;
        this.onNameChanged.trigger(this);
    }

    protected nameOnChanged = (sender:any):void =>
    {
         console.log('name_onChanged from Animal');
    }

    constructor()
    {
        this.onNameChanged.subscribe(this.nameOnChanged);
    }
}
 
export class Horse extends Animal
{
    protected _name:string = 'Horse';
   
    public get name()
    {
        return this._name;
    }

    public set name(value:string)
    {
        this._name = value;
        this.onNameChanged.trigger(this);
    }

    constructor()
    {
        super();
    }

    protected nameOnChanged = (sender:Horse):void =>
    {
        console.log('name_onChanged from Horse');
    }
}


export interface TestClassOnChangedCallback
{
    (sender:Animal):void;
}
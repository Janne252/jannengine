import EventHandler from '../event/eventHandler';

export default class Range
{
    private _min:number;
    private _max:number;
    private _onChanged = new EventHandler<RangeOnChangedCallback>();

    public get onChanged(): EventHandler<RangeOnChangedCallback>
    {
        return this._onChanged;
    }
    
    public get min():number
    {
        return this._min;
    }

    public set min(value:number)
    {
        let previosMin = this._min;
        this._min = value;
        this._onChanged.trigger(this, previosMin, this._max);
    }    

    public get max():number
    {
        return this._max;
    }

    public set max(value:number)
    {
        let previosMax = this._max;
        this._max = value;
        this._onChanged.trigger(this, this._min, previosMax);
    }

    constructor(min:number, max:number)
    {
        this._min = min;
        this._max = max;
    }
}

export interface RangeOnChangedCallback
{
    (sender:Range, previousMin:number, previousMax:number);
}
import GameEngine from './gameEngine';

export default class InputProvider
{
    private _engine:GameEngine;

    constructor(engine:GameEngine)
    {
        engine.canvas.addEventListener('mousemove', this._onMouseMove);
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keypress', this._onKeyPress);
        window.addEventListener('keyup', this._onKeyUp);

        engine.canvas.addEventListener('touchstart', this._onTouchStart);
        engine.canvas.addEventListener('touchend', this._onTouchEnd);
        engine.canvas.addEventListener('touchcancel', this._onTouchCancel);
        engine.canvas.addEventListener('touchmove', this._onTouchMove);

        engine.canvas.addEventListener('click', this._onClick);
        engine.canvas.addEventListener('dblkclick', this._onDoubleClick);
        engine.canvas.addEventListener('mousedown', this._onMouseDown);
        engine.canvas.addEventListener('mouseup', this._onMouseUp);

        engine.canvas.addEventListener('mouseleave', this._onMouseLeave);
        engine.canvas.addEventListener('mouseenter', this._onMouseEnter);

        this._engine = engine;
    } 

    private _onKeyDown = (e:KeyboardEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.keyDown(e);
    }

    private _onKeyPress = (e:KeyboardEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.keyPress(e);
    }

    private _onKeyUp = (e:KeyboardEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.keyUp(e);
    }

    private _onTouch = (e:TouchEvent) =>
    {
        if (this._engine.paused)
            return;
            
        if (e.touches.length > 0)
        {
            var touch = e.touches[0];
            this._engine.updateMousePos(touch.clientX, touch.clientY);
        }
    }

    private _onTouchStart = (e:TouchEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.touchStart(e);
        this._onTouch(e);
    }

    private _onTouchEnd = (e:TouchEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.touchEnd(e);
    }

    private _onTouchCancel = (e:TouchEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.touchCancel(e);
    } 

    private _onTouchMove = (e:TouchEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.touchMove(e);
        this._onTouch(e);
    }

    private _onClick = (e:MouseEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.click(e);
    }

    private _onDoubleClick = (e:MouseEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.doubleClick(e);
    }

    private _onMouseDown = (e:MouseEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.isMouseDown = true;
        this._engine.mouseDown(e);
    }

    private _onMouseUp = (e:MouseEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.isMouseDown = false;
        this._engine.mouseUp(e);
    }

    private _onMouseLeave = (e:MouseEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.isMouseOut = true;
        this._engine.mouseLeave(e);
    }

    private _onMouseEnter = (e:MouseEvent) =>
    {
        if (this._engine.paused)
            return;
            
        this._engine.isMouseOut = false;
        this._engine.mouseEnter(e);
    }

    private _onMouseMove = (e:MouseEvent) => 
    {
        if (this._engine.paused)
            return;
        
        this._engine.mouseMove(e);

        this._engine.updateMousePos(e.clientX, e.clientY);
    }
}
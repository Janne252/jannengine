import InputProvider from './inputProvider';
import Vector2D from '../system/drawing/vector2d';
import Size from '../system/drawing/size';
import Rectangle from '../system/drawing/rectangle';
import FullscreenRequest from './fullscreenRequest';
import Random from '../system/random';
import Padding, {IPadding} from '../system/drawing/padding';

export default class GameEngine
{
    private static _canvasCSS:string = 'html,body{margin:0;padding:0;overflow:hidden;}canvas#render{background-color:black;}';
    private _inputProvider:InputProvider;
    private _canvas:HTMLCanvasElement = null;
    private _fps:number = 0;
    private _lastFrameTime:number = 0;
    private _betweenFrameTime = 5;
    private _logicTickInterval:number = 10;
    private _bounds:Rectangle = new Rectangle(0, 0, 0, 0);

    public autoFitCanvas:boolean = true;
    public targetFrameRate:number = 60;
    public manualRender:boolean = false;
    public renderOnResize:boolean = true;
    public clearCanvasPerFrame:boolean = true;
    public fullScreenPrompt:boolean = true;
    public canvasCreated:boolean = false;

    public paused:boolean = false;
    /**
     * Function that can be used to initialize variables before rendering starts.
     */
    public init = function() {};

    /**
     * Main function used to render the frames.
     */
    public render:(ctx:CanvasRenderingContext2D) => void = function(ctx:CanvasRenderingContext2D) {};


    public tick:() => void = function() {};

    public windowResize:(e:Event) => void = function(e:Event) {};

    public keyDown:KeyboardEventHandler = function(e:KeyboardEvent) {};
    public keyPress:KeyboardEventHandler = function(e:KeyboardEvent) {};
    public keyUp:KeyboardEventHandler = function(e:KeyboardEvent) {};

    public touchStart:TouchEventHandler = function(e:TouchEvent) {};
    public touchEnd:TouchEventHandler = function(e:TouchEvent) {};
    public touchCancel:TouchEventHandler = function(e:TouchEvent) {};
    public touchMove:TouchEventHandler = function(e:TouchEvent) {};

    public mouseMove:MouseEventHandler = function(e:MouseEvent) {};
    public click:MouseEventHandler = function(e:MouseEvent) {};
    public doubleClick:MouseEventHandler = function(e:MouseEvent) {};
    public mouseDown:MouseEventHandler = function(e:MouseEvent) {};
    public mouseUp:MouseEventHandler = function(e:MouseEvent) {};

    public mouseLeave:MouseEventHandler = function(e:MouseEvent) {};
    public mouseEnter:MouseEventHandler = function(e:MouseEvent) {};

    public isMouseDown:boolean = false;
    public isMouseOut:boolean = false;

    public mousePos:Vector2D = new Vector2D(0, 0);
    
    constructor()
    constructor(width:number, height:number) 
    constructor(width?:number, height?:number) 
    {
        this._bounds.width = width === undefined ? 0 : width;
        this._bounds.height = height === undefined ? 0 : height;
        this._bounds.x = width === undefined ? 0 : width / 2;
        this._bounds.y = height === undefined ? 0 : height / 2;
    }

    private _logicTick = () =>
    {
        if (!this.paused)
        {
            this.tick();
        }
    }

    private _tryRenderFrame = () =>
    {
        if (!this.paused && !this.manualRender)
        {
            var now = performance.now();
            var sinceLast = now - this._lastFrameTime;

            var targetTimeBetweenFrames = 1000 / this.targetFrameRate;

            if (sinceLast >= targetTimeBetweenFrames - this._betweenFrameTime)
            {
                this._renderFrame();

                this._fps = 1000.0 / (now - this._lastFrameTime);
                this._lastFrameTime = now;
            }
            
            requestAnimationFrame(this._tryRenderFrame);
        }
    }

    private _renderFrame():void
    {
        if (this.clearCanvasPerFrame)
        {
            this.clearCanvas();
        }

        this.render(this.context);
    }

    private updateBounds():void
    {   
        this._bounds.noUpdate = true;
        this._bounds.x = this.width / 2;
        this._bounds.y = this.height / 2;
        this._bounds.width = this.width;
        this._bounds.height = this.height;
        this._bounds.noUpdate = false;
        this._bounds.update();
    }

    private _updateCanvasSize():void
    {
        if (this.autoFitCanvas)
        {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
            this.updateBounds();
        }
    }

    public clearCanvas():void
    {
        this.context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    private _createCanvas(width:number = 320, height:number = 640):void
    {
        if (!this.canvasCreated)
        {
            var canvasCSS = document.createElement('style');
            canvasCSS.innerText = GameEngine._canvasCSS;

            document.head.appendChild(canvasCSS);

            var canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'render');
            canvas.setAttribute('width', width.toString());
            canvas.setAttribute('height', height.toString());

            this._canvas = canvas;
            document.body.appendChild(this._canvas);

            this.canvasCreated = true;
            this._updateCanvasSize();
        }
    }

    public run():void
    {
        this._createCanvas(this._bounds.width, this._bounds.height);
        this._inputProvider = new InputProvider(this);

        this.init();

        window.addEventListener("resize", this._onWindowResize.bind(this));

        if (this.fullScreenPrompt)
        {
            var request = new FullscreenRequest();

            request.show({
                accepted: () => {},
                cancelled: () => {}
            });
        }

        if (!this.manualRender)
        {
            this._tryRenderFrame();
        }
        
        setInterval(this._logicTick, this._logicTickInterval); 
    }

    public getRandomPosition(padding?:IPadding|Padding):Vector2D
    {
        if (padding !== undefined)
        {
            return new Vector2D(Random.next(padding.left, this.width - padding.right + 1), Random.next(padding.top, this.height - padding.bottom + 1));
        }
        else
        {
            return new Vector2D(Random.next(this.width + 1), Random.next(this.height + 1));
        }
    }

    public get canvas():HTMLCanvasElement
    {
        return this._canvas;
    }

    public get context():CanvasRenderingContext2D
    {
        return this._canvas != null ? this._canvas.getContext('2d') : null;
    }

    public get mouseX():number
    {
        return this.mousePos.x;
    }    
    
    public get mouseY():number
    {
        return this.mousePos.y;
    }

    public get width():number
    {
        return this._canvas != null ? this._canvas.width : 0;
    }

    public get height():number
    {
        return this._canvas != null ? this._canvas.height : 0;
    }

    public get fps():number
    {
        return this._fps;
    }

    public get bounds():Rectangle
    {
        return this._bounds;
    }

    public updateMousePos(x:number, y:number):void
    {
        this.mousePos.x = x;
        this.mousePos.y = y;
    }

    private _onWindowResize(e:Event):void
    {
        if (this.paused)
            return;

        this._updateCanvasSize();

        if (this.renderOnResize && this.manualRender)
        {
            this._tryRenderFrame();
        }

        this.windowResize(e);
    }
}

export interface TouchEventHandler
{
    (e:TouchEvent):void;
}

export interface MouseEventHandler
{
    (e:MouseEvent):void;
}

export interface KeyboardEventHandler
{
    (e:KeyboardEvent):void;
}
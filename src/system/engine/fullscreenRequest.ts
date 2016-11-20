/**
 * Represents DOM-based request to enable fullscreen for the client.
 */
export default class FullscreenRequest
{
    private static _css = '.fullscreen-request{position:absolute;top:0;background-color:rgba(0,0,0,.5);color:#fff;font-family:monospace;margin:0 auto;width:100%;text-align:center;font-size:6vh;padding-top:1vh}.fullscreen-request:hover{background-color:rgba(255,255,255,.1)}.fullscreen-request>.title{font-size:4vh;margin-bottom:1vh}.fullscreen-request>.title>.material-icons{font-size:6vh;position:relative;top:1.75vh;margin-top:-3vh}.fullscreen-request>.button:hover{cursor:pointer}.fullscreen-request>.accept.button:hover{color:#006400}.fullscreen-request>.cancel.button:hover{color:#8b0000}.fullscreen-request>.button>.material-icons{font-size:6vh}';

    private static _html = '<div class="fullscreen-request" id="fullscreen-request"> <div class="title"> <i class="material-icons">fullscreen</i> Fullscreen? </div><span class="accept button" id="fullscreen-accept"><i class="material-icons">check_circle</i></span> <span class="cancel button" id="fullscreen-cancel"><i class="material-icons">cancel</i></span></div>';

    /**
     * Creates a new instance of FullscreenRequest.
     */
    constructor()
    {

    }
    /**
     * Shows the request.
     * @param handlers Handlers to handle the resulting click events.
     */
    public show(handlers:FullscreenRequestHandler):void
    {
        var requestCSS:HTMLStyleElement = document.createElement('style');
        requestCSS.innerText = FullscreenRequest._css;

        var requestHTML = document.createElement('div');
        requestHTML.innerHTML = FullscreenRequest._html;

        document.body.appendChild(requestHTML);
        document.head.appendChild(requestCSS);

        var self = this;

        document.getElementById('fullscreen-accept').addEventListener('click', function()
        {
            document.body.removeChild(requestHTML);
            handlers.accepted();
            self.requestFullscreen();
        });    
        
        document.getElementById('fullscreen-cancel').addEventListener('click', function()
        {
            document.body.removeChild(requestHTML);
            handlers.cancelled();
        });
    }
    /**
     * Sends the actual fullscreen request. Must be called from a user-originated event handler.
     */
    public requestFullscreen():void
    {
        var body = document.body;

        // Supports most browsers and their versions.
        var requestMethod = (<any>body).requestFullScreen || body.webkitRequestFullScreen 
        || (<any>body).mozRequestFullScreen || (<any>body).msRequestFullScreen;

        if (requestMethod) 
        {
            // Native full screen.
            requestMethod.call(body);

        } 
        else if (typeof (<any>(window)).ActiveXObject !== "undefined") 
        {
            // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");

            if (wscript !== null) 
            {
                wscript.SendKeys("{F11}");
            }
        }
    }
}

/**
 * Represents a handler for FullscreenRequest.show method.
 */
export interface FullscreenRequestHandler
{
    /**
     * Called when the fullscreen request accept button is clicked.
     */
    accepted():void;
   
   /**
    * Called when the fullscreen request cancel button is clicked.
    */
    cancelled():void;
}
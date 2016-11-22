import {array_remove} from '../helpers/array';

/**
 * A class that allows playing multiple instances of the same audio file.
 */
export default class Sound
{
    private _audioPlayers:HTMLAudioElement[] = [];
    private _initialAudioPlayer:HTMLAudioElement;
    
    private _url:string = '';
    private _isLoaded:boolean = false;
    private _volume:number = 1.0;

    /**
     * Number of currently playing channels.
     */
    public get count():number
    {
        return this._audioPlayers.length;
    }
    /**
     * Whether or not there is at least one active channel playing.
     */
    public isPlaying():boolean
    {
        return this.count > 0;
    }
    /**
     * URL to the audio source file.
     */
    public get url():string
    {
        return this._url;
    }
    /**
     * Volume used to play the sound, between 0.0 and 1.0.
     */
    public get volume():number
    {
        return this._volume;
    }
    /**
     * Volume used to play the sound, between 0.0 and 1.0.
     * @param value The value to set the volume to.
     */    
    public set volume(value:number)
    {
        this._volume = value;
        this._updateVolume();
    }
    /**
     * Maximum number of channels (instances) the sound can play at the same time.
     */
    public maxChannels:number = 32;
    /**
     * Triggered when the audio file has finished loading and can be played.
     */
    public onLoaded:SoundOnLoadedCallback = function(e:Event) {}
    /**
     * Whether or not the audio file is available for playing.
     */
    public get isLoaded():boolean
    {
        return this._isLoaded;
    }
    /**
     * Creates a new instance of Sound.
     * @param url Url to the audio source file. 
     */
    constructor(url:string)
    {
        this._url = url;
        this._initialAudioPlayer = new Audio(this.url);
        this._initialAudioPlayer.addEventListener('canplaythrough', this._canPlayThrough);
    }
    /**
     * Reacts to the initial audio player canplaythrough event.
     * @param e The event.
     */
    private _canPlayThrough = (e:Event):void =>
    {
        this._isLoaded = true;
        this.onLoaded(e);
    }
    /**
     * Plays the sound if the maximum number of channels is not reached.
     * Returns true if the sound was played.
     */
    public play():boolean
    {
        if (this._isLoaded && this._audioPlayers.length < this.maxChannels)
        {
            let player = new Audio(this.url);
            player.volume = this.volume;        

            player.play();

            player.addEventListener('ended', this.onAudioEnded);

            this._audioPlayers.push(player);

            return true;
        }
        else
        {
            return false;
        }
    }
    /**
     * Reacts to the ended event of Audio element.
     * @param e The event object.
     */
    private onAudioEnded = (e:MediaStreamErrorEvent) =>
    {
        array_remove(this._audioPlayers, e.srcElement);
    }
    /**
     * Updates the volume to the all currently existing audio players.
     */
    private _updateVolume():void
    {
        let audioPlayer:HTMLAudioElement;
        for(let i = 0; i < this.count; i++)
        {
            audioPlayer = this._audioPlayers[i];
            audioPlayer.volume = this._volume;
        }
    }
}

/**
 * Type of Sound.onLoaded callback.
 */
export interface SoundOnLoadedCallback
{
    /**
     * @param e The event.
     */
    (e:Event):void;
}
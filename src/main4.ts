import GameEngine from './system/engine/gameEngine';
import Rectagle from './system/drawing/rectangle';
import Circle from './system/drawing/circle';
import Ellipse from './system/drawing/ellipse';
import Line, {LineCap, LineJoin} from './system/drawing/line/line';
import RegularPolygon from './system/drawing/regularPolygon';
import Star from './system/drawing/star';
import Text from './system/drawing/text';
import {TextAlign, TextBaseLine, TextDirection} from './system/drawing/text';
import Color from './system/component/color';
import Vector2D from './system/component/vector2d';
import Random from './system/component/random';
import {lerp, map, rotateTowards, normalizeRadians} from './system/helpers/math';
import Player from './spaceWars/player';
import Enemy from './spaceWars/enemy';
import Projectile from './spaceWars/projectile';


var engine = new GameEngine(230, 640);
engine.fullScreenPrompt = false;

var fpsText:Text = new Text(10, 10, '0 fps', Color.white);
fpsText.stroke = false;

var circle:Circle = new Circle(0, 0, 40, Color.random(), Color.random());

engine.init = function()
{

}

engine.windowResize = function(e:Event)
{

}

engine.render = (ctx:CanvasRenderingContext2D) =>
{
    //fpsText.render(ctx);
    circle.render(ctx);
    circle.position.x += 1;
    circle.position.y += 1;
}

engine.tick = function()
{
    fpsText.text = engine.fps + ' fps';
    //circle.position = circle.position.lerp(engine.mousePos, 0.01);


}

engine.run();
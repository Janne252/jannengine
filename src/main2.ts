import GameEngine from './engine/gameEngine';
import Rectagle from './system/drawing/rectangle';
import Circle from './system/drawing/circle';
import Ellipse from './system/drawing/ellipse';
import Line from './system/drawing/line';
import RegularPolygon from './system/drawing/regularPolygon';
import Star from './system/drawing/star';
import Text from './system/drawing/text';
import Color from './system/drawing/color';
import Vector2D from './system/drawing/vector2d';
import {lerp, map} from './system/helpers/math';

import {Animal, Horse} from './system/testClass';

var engine = new GameEngine(230, 640);
engine.fullScreenPrompt = false;

var star:Star;
var line:Line;

engine.init = function()
{
    line = new Line(0, 0, 100, 100, 4, Color.red);

    star = new Star(500, 500, 5, 75, 250, Color.random(), Color.random());

    
    /*window.setTimeout(() =>
    {
        console.log('Update star pointCount');
        star.pointCount = 12;
       
    }, 500);    
    
    window.setTimeout(() =>
    {
        console.log('Update star position.x');
        star.position.x += 100;
    }, 1000);    
    
    window.setTimeout(() =>
    {
        console.log('Update star position by setting it to a new pos');
        star.position = new Vector2D(600, 600);
    }, 1500);
    */

    window.setTimeout(() =>
    {
        console.log('Update star line lineWidth');
        line.lineWidth = 40;
       
    }, 500);    
    
    window.setTimeout(() =>
    {
        console.log('Update line.position.x');
        line.position.x = 400;
    }, 1000);    
    
    window.setTimeout(() =>
    {
        console.log('Update line.endPosition.y');
        line.endPosition.y = 600;
    }, 1500);    
    
    window.setTimeout(() =>
    {
        console.log('Update line with new position');
        line.position = new Vector2D(0, 0);
    }, 2000);    

    window.setTimeout(() =>
    {
        console.log('Update line with new endPosition');
        line.endPosition = new Vector2D(500, 500);
    }, 2500);

}

engine.render = function(ctx:CanvasRenderingContext2D)
{
    star.render(ctx);
    line.render(ctx);
}

engine.tick = function()
{
 
}

engine.run();
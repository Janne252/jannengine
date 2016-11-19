import GameEngine from './engine/gameEngine';
import Rectagle from './system/drawing/rectangle';
import Circle from './system/drawing/circle';
import Ellipse from './system/drawing/ellipse';
import Line from './system/drawing/line';
import {LineCap, LineJoin} from './system/drawing/renderable';
import RegularPolygon from './system/drawing/regularPolygon';
import Star from './system/drawing/star';
import Text from './system/drawing/text';
import {TextAlign, TextBaseLine, TextDirection} from './system/drawing/text';
import Color from './system/drawing/color';
import Vector2D from './system/drawing/vector2d';
import {lerp, map} from './system/helpers/math';
import GameEntity from './engine/gameEntity';


var engine = new GameEngine(230, 640);
engine.fullScreenPrompt = false;

var entity:GameEntity;
var gravity:Vector2D;


var circle:Circle;
engine.init = function()
{
    gravity = new Vector2D(0, -0.25);
    entity = new GameEntity(engine.width / 2, engine.height - 20);
    entity.velocity.x = 1;
    entity.velocity.y = -10;
    entity.gravity = gravity;

    circle = new Circle(entity.position.x, entity.position.y, 20, Color.red, Color.white);
    circle.position = entity.position;
}

engine.render = function(ctx:CanvasRenderingContext2D)
{
    circle.render(ctx);
}

engine.tick = function()
{
    entity.update();

    if (entity.position.y > engine.height - 20 && entity.velocity.y > 0)
    {
        //entity.velocity = new Vector2D(-entity.velocity.x * 0.8, -entity.velocity.y * 0.8);

        entity.velocity.multiply(0.95);

        if (Math.abs(entity.velocity.y) < 1)
        {
            entity.velocity.y = 0;
        }
    }


}

engine.run();
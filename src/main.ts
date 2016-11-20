import GameEngine from './system/engine/gameEngine';
import Rectagle from './system/drawing/rectangle';
import Circle from './system/drawing/circle';
import Ellipse from './system/drawing/ellipse';
import Line from './system/drawing/line/line';
import RegularPolygon from './system/drawing/regularPolygon';
import Text from './system/drawing/text';
import Color from './system/component/color';
import {lerp, map} from './system/helpers/math';


import {Animal, Horse} from './system/testClass';

var engine = new GameEngine(230, 640);
engine.fullScreenPrompt = false;

var rect:Rectagle;
var circle:Circle;
var ellipse:Ellipse;
var line:Line;
var text:Text;
var text1:Text;
var text2:Text;

var circle1;
var circle2;

var rPolygon:RegularPolygon;

engine.init = function()
{
    var animal = new Animal();
    var horse = new Horse();

    console.log('Animal name: ' + animal.name);
    console.log('Horse name: ' + horse.name);

    animal.name = 'New Animal';
    horse.name = 'New Horse';

    console.log('Animal name: ' + animal.name);
    console.log('Horse name: ' + horse.name);

    rect = new Rectagle(200, 200, 300, 400, Color.random(), Color.random());
    circle = new Circle(300, 300, 200, Color.random(), Color.random());
    ellipse = new Ellipse(300, 300, 200, 400, Color.random(), Color.random());
    //line = new Line(100, 100, 400, 400, 40, Color.random());

    //circle1 = new Circle(line.position.x, line.position.y, 5, Color.red);
    //circle2 = new Circle(line.endPosition.x, line.endPosition.y, 5, Color.red);
    text = new Text(0, 0, '', Color.white, Color.black);
    text.font = '16px Monospace';
    text.stroke = false;

    text1 = new Text(0, 0, '', Color.white);
    text1.stroke = false;

    text2 = new Text(0, 0, '', Color.white);
    text2.stroke = false;

    rPolygon = new RegularPolygon(800, 400, 200, 8, Color.random(), Color.random());
}

engine.render = function(ctx:CanvasRenderingContext2D)
{
   //rect.render(ctx);
   //circle.render(ctx);
   //ellipse.render(ctx);

   //line.render(ctx);
   //circle1.render(ctx);
   //circle2.render(ctx);

   text.render(ctx);
   text1.render(ctx);
   text2.render(ctx);
   rPolygon.render(ctx);

   //line.test(ctx);
}

engine.tick = function()
{
    //line.endPosition.x += 0.1;
    
    rPolygon.rotation = map(engine.mouseX, 0, engine.width, -Math.PI, Math.PI);
    //text1.position.x = line.position.x;
    //text1.position.y = line.position.y;
    //text2.position.x = line.endPosition.x;
    //text2.position.y = line.endPosition.y;

    //text1.text = line.position.toString();
    //text2.text = line.endPosition.toString();

    text.position.x = engine.mouseX;
    text.position.y = engine.mouseY;
    //text.text = `(${engine.mouseX}, ${engine.mouseY}) = ${line.getDistance(engine.mousePos)}`;

    rect.position.lerp(engine.mousePos, 0.001);
    circle.position.lerp(engine.mousePos, 0.001);

    if(rect.intersects(engine.mousePos))
    {
        rect.fillStyle = Color.red;
    }
    else
    {
        rect.fillStyle = Color.blue;
    }

    if(circle.intersects(engine.mousePos))
    {
        circle.fillStyle = Color.red;
    }
    else
    {
        circle.fillStyle = Color.green;
    }

    if (ellipse.intersects(engine.mousePos))
    {
        ellipse.fillStyle = Color.red;
    }
    else
    {
        ellipse.fillStyle = Color.green;
    }

    /*if(line.intersects(engine.mousePos))
    {
        line.strokeStyle = Color.red;
    }
    else
    {
        line.strokeStyle = Color.green;
    }*/
}

engine.run();
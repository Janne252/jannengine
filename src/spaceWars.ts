import GameEngine from './engine/gameEngine';
import Rectagle from './system/drawing/rectangle';
import Circle from './system/drawing/circle';
import Ellipse from './system/drawing/ellipse';
import Line from './system/drawing/line';
import {LineCap, LineJoin} from './system/drawing/renderable';
import RegularPolygon from './system/drawing/regularPolygon';
import Star from './system/drawing/star';
import Text from './system/drawing/text';
import Polygon from './system/drawing/polygon';
import {TextAlign, TextBaseLine, TextDirection} from './system/drawing/text';
import Color from './system/drawing/color';
import Vector2D from './system/drawing/vector2d';
import Padding from './system/drawing/padding';
import Random from './system/random';
import {lerp, map, rotateTowards, normalizeRadians} from './system/helpers/math';
import {array_remove} from './system/helpers/array';
import Player from './spaceWars/player';
import Enemy from './spaceWars/enemy';
import Projectile from './spaceWars/projectile';
import ProjectileSystem from './system/simulation/projectile/projectileSystem';
import ProjectileSystemEntry from './system/simulation/projectile/projectileSystemEntry';
import ProjectileSystemResult from './system/simulation/projectile/projectileSystemResult';

import Sound from './system/sound/sound';

let enableKills = true;
let enemyCanShoot = false;

let engine = new GameEngine(230, 640);
engine.fullScreenPrompt = true;

let player:Player;
let text:Text = new Text(20, 50, '', Color.white, Color.black);
let fpsText:Text = new Text(10, 10, '0 fps', Color.white);
fpsText.stroke = false;

text.stroke = false;
text.font = '32px Monospace';

let rotationStep = Math.PI * 0.01;
let damagePerShot = 0.1;
let won:boolean = false;
let lost:boolean = false;
let score:number = 0;
let rect:Rectagle;

let projectileSystem:ProjectileSystem;

let audio = new Audio('sound/damage_01.mp3');
let audio2 = new Audio('sound/damage_01.mp3');

let takeHitSound = new Sound('sound/damage_01.mp3');
takeHitSound.volume = 0.01;

let shootSound = new Sound('sound/shoot_01.mp3');
shootSound.volume = 0.01;

let polygon:Polygon;
let circle:Circle;

let maxEnemies = 3;
let enemies:Enemy[] = [];
let scoreText:Text;


let onProjectileHit = (sender:ProjectileSystem, result:ProjectileSystemResult) =>
{
    takeHitSound.play();

    if (result.owner == player && result.died)
    {
        score++;
    }
}

engine.init = function()
{
    scoreText = new Text(10, engine.height - 20, 'Score: 0', Color.white);
    scoreText.stroke = false;

    rect = new Rectagle(engine.width / 2, engine.height / 2, 50, 500, Color.random(), Color.random());
    
    projectileSystem = new ProjectileSystem();

    player = new Player(engine.width / 2, engine.height / 2, engine.bounds, 1000);
    player.fillStyle = Color.green;
    player.strokeStyle = Color.white;
    player.projectileDamage = 10;
    //player.aimZoneEnabled = true;

    enemyDied(null);

    projectileSystem.onProjectileHit.subscribe(onProjectileHit);

    polygon = new Polygon(Color.random(), Color.random());
    circle = new Circle(0, 0, 5, Color.red, Color.white);
    for(let i = 0; i < 10; i++)
    {
        //polygon.addVertex(new Vector2D(Random.next(engine.width + 1), Random.next(engine.height +1)));
    }
}

let enemyDied = (deadEnemy:Enemy, spawnNew:boolean = true) => 
{
    if (deadEnemy !== undefined)
    {
        projectileSystem.removeByOwner(deadEnemy);

        array_remove(enemies, deadEnemy);
    }

    projectileSystem.removeByOwner(player);

    if (spawnNew)
    {
        let enemyPos = engine.getRandomPosition(new Padding(100));
        let newEnemy = new Enemy(enemyPos.x, enemyPos.y, engine.bounds, 100);
        newEnemy.projectileDamage = 1;
        newEnemy.fillStyle = new Color(150, 0, 0, 1);
        enemies.push(newEnemy);
        projectileSystem.add(new ProjectileSystemEntry(newEnemy, player));
        projectileSystem.add(new ProjectileSystemEntry(newEnemy, enemies));
    }

    projectileSystem.add(new ProjectileSystemEntry(player, enemies));

}

engine.windowResize = function(e:Event) 
{
    scoreText.y = engine.height - 20;   
}

engine.keyDown = (e:KeyboardEvent) => {}

engine.mouseMove = (e:MouseEvent) => 
{
    if (player.aimZoneEnabled)
    {
        var mouseDist = engine.mousePos.distanceTo(player.position);
        player.mouseInAimZone = mouseDist <= player.aimZoneRadius;

        if (player.mouseInAimZone && !player.isAimingMode)
        {
            player.isAimingMode = true;
            player.targetPosition = new Vector2D(engine.mousePos);
        }
        else if (!player.mouseInAimZone)
        {
            player.isAimingMode = false;
            player.targetPosition = engine.mousePos;
        }
    }
    else
    {
        player.targetPosition = engine.mousePos;
    }
}

engine.click = (e:MouseEvent) => 
{
    if (!lost)
    {
        player.shoot();
        shootSound.play();
    }

    let randomPos = polygon.getRandomPosition();

    if (randomPos != null)
    {
        circle.position = randomPos;
    }

    //polygon.addVertex(engine.mousePos.copy());
    //player.targetPosition.set(engine.mousePos);
}

engine.render = (ctx:CanvasRenderingContext2D) =>
{
    scoreText.render(ctx);
    polygon.render(ctx);
    //circle.render(ctx);
    //rect.render(ctx);
    if (!lost)
    {
        player.render(ctx);
    }
    if(!won)
    {
        for(let enemy of enemies)
        {
            enemy.render(ctx);
        }
    }
    text.render(ctx);
    //fpsText.render(ctx);
}

engine.tick = function()
{
    scoreText.text = 'Score: ' + score;
    //rect.rotation = normalizeRadians(rect.rotation + 0.01);
    fpsText.text = engine.fps + ' fps';

    if (Polygon.intersects2(polygon.vertices, engine.mousePos))
    {
        polygon.fillStyle = Color.red;
    }
    else
    {
        polygon.fillStyle = Color.green;
    }
    //player.rotation = rotateTowards(player.rotation, normalizeRadians(player.position.getAngleTowards(engine.mousePos)), rotationStep);
    player.rotation = normalizeRadians(player.position.getAngleTowardsVector(engine.mousePos));

    for(let enemy of enemies)
    {
        enemy.rotation = normalizeRadians(enemy.position.getAngleTowardsVector(player.position));
        enemy.update();

        if (enemy.hitpoints.isDead && won == false && lost == false)
        {
            enemyDied(enemy, false);
            //won = true;
            // text.text = 'Olet viineri!';
            //text.fillStyle = Color.green;
        }

        var dist = player.position.distanceTo(enemy.position);
        if (!lost && !won)
        {
            let result = projectileSystem.update();

            if (enemyCanShoot && Random.next(0, dist / 10) == 1)
            {
                enemy.shoot();
                shootSound.play();
            }
        }
    }

    player.update();
    
    if(player.hitpoints.isDead && lost == false && won == false)
    {
        lost = true;
        text.text = 'You are dead. Reload the page to play again.';
        text.fillStyle = Color.red;
    }
}

window.setTimeout(() =>
{
    //enemy.targetPosition = engine.getRandomPosition({top: 100, right: 100, bottom: 100, left: 100});
    enemyCanShoot = true;
}, 2000);

window.setInterval(() => 
{
    if (enemies.length < maxEnemies)
    {
        enemyDied(null);
    }
    //player.shoot();
}, 5000);
engine.run();
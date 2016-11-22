import GameEngine from './system/engine/gameEngine';
import Rectagle from './system/drawing/rectangle';
import Circle from './system/drawing/circle';
import Ellipse from './system/drawing/ellipse';
import Line from './system/drawing/line';
import RegularPolygon from './system/drawing/regularPolygon';
import Star from './system/drawing/star';
import Text from './system/drawing/text';
import Polygon from './system/drawing/polygon';
import {TextAlign, TextBaseLine, TextDirection} from './system/drawing/text';
import Color from './system/component/color';
import Vector2D from './system/component/vector2d';
import Padding from './system/component/padding';
import Random from './system/component/random';
import {lerp, map, rotateTowards, normalizeRadians} from './system/helpers/math';
import {array_remove} from './system/helpers/array';
import Player from './spaceWars/player';
import Enemy from './spaceWars/enemy';
import Projectile from './spaceWars/projectile';
import ProjectileSystem from './system/engine/simulation/projectile/projectileSystem';
import ProjectileSystemEntry from './system/engine/simulation/projectile/projectileSystemEntry';
import ProjectileSystemResult from './system/engine/simulation/projectile/projectileSystemResult';

import Sound from './system/sound/sound';

let enemyCanShoot = false;

let engine = new GameEngine(230, 640);
engine.fullScreenPrompt = true;
engine.profileRender = false;

let player:Player;
let statusText:Text;
let fpsText:Text;

let won:boolean = false;
let lost:boolean = false;
let score:number = 0;

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
    statusText = new Text(20, 50, '', Color.white, Color.black);
    statusText.stroke = false;
    statusText.font = '32px Monospace';

    fpsText = new Text(10, 10, '0 fps', Color.white);
    fpsText.stroke = false;

    scoreText = new Text(10, engine.height - 20, 'Score: 0', Color.white);
    scoreText.stroke = false;
    
    fpsText.rotation
    player = new Player(engine.width / 2, engine.height / 2, engine.bounds, 1000);
    player.fillStyle = Color.green;
    player.strokeStyle = Color.white;
    player.projectileDamage = 10;
    //player.aimZoneEnabled = true;

    enemyDied(null);

    engine.projectileSystem.onProjectileHit.subscribe(onProjectileHit);
}

let enemyDied = (deadEnemy:Enemy, spawnNew:boolean = true) => 
{
    if (deadEnemy !== undefined)
    {
        engine.projectileSystem.removeByOwner(deadEnemy);

        array_remove(enemies, deadEnemy);
    }

    engine.projectileSystem.removeByOwner(player);

    if (spawnNew)
    {
        let enemyPos:Vector2D;
        let tooClose:boolean = true;
        let attempts = 0;
        let maxAttempts = 1000;

        do
        {
            enemyPos = engine.getRandomPosition(new Padding(100));
            tooClose = enemyPos.distanceTo(player.position) <= engine.width * 0.33;
            attempts++;

            if (attempts == maxAttempts)
            {
                //console.log('Max attempts reached, exiting.');
                return;
            }
        }
        while(tooClose);
        //console.log('Spawned after ' + attempts + ' attempts.');
        let newEnemy = new Enemy(enemyPos.x, enemyPos.y, engine.bounds, 100);
        newEnemy.projectileDamage = 1;
        newEnemy.fillStyle = new Color(150, 0, 0, 1);
        enemies.push(newEnemy);
        engine.projectileSystem.add(new ProjectileSystemEntry(newEnemy, player));
        engine.projectileSystem.add(new ProjectileSystemEntry(newEnemy, enemies));
    }

    engine.projectileSystem.add(new ProjectileSystemEntry(player, enemies));

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
}

engine.render = (ctx:CanvasRenderingContext2D) =>
{
    scoreText.render(ctx);

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

    statusText.render(ctx);
    fpsText.render(ctx);
}

engine.tick = function()
{
    scoreText.text = 'Score: ' + score;

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
            if (enemyCanShoot && Random.next(0, dist / 10) == 1)
            {
                enemy.shoot();
                //shootSound.play();
            }
        }
    }

    let result = engine.projectileSystem.update();

    player.update();
    
    if(player.hitpoints.isDead && lost == false && won == false)
    {
        lost = true;
        statusText.text = 'You are dead. Reload the page to play again.';
        statusText.fillStyle = Color.red;
    }
}

window.setTimeout(() =>
{
    enemyCanShoot = true;
}, 2000);

window.setInterval(() => 
{
    if (enemies.length < maxEnemies)
    {
        enemyDied(null);
    }
    //player.shoot();
}, 3000);

window.setInterval(() =>
{
        fpsText.text = Math.floor(engine.fps) + ' fps';
}, 250);
engine.run();
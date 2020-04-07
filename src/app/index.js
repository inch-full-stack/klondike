import * as PIXI from "pixi.js";
import * as TWEEN from '@tweenjs/tween.js';

var width = window.innerWidth; //получаем ширину экрана
var height = window.innerHeight; // получаем высоту экрана
var app; //создаем глобальную переменную нашей игры
var colors = [0xFFFF0B, 0xFF700B, 0x4286f4, 0x4286f4, 0xf441e8, 0x8dff6d, 0x41ccc9, 0xe03375, 0x95e032, 0x77c687, 0x43ba5b, 0x0ea3ba]; //массив цветов
var gravity = 4;
var figuresAmount = -1; //количество созданных фигур
var figure = []; //массив хранящий нашу фигуру



var model = {
    // ? Получение backround с помощью canvas
    createCanvas: function() {
        // var canvas = document.querySelector('canvas');

        // canvas.setAttribute('width', window.innerWidth);
        // canvas.setAttribute('height', window.innerHeight);

        // var ctx = canvas.getContext('2d');
        // var centerX = canvas.width / 2;
        // var centerY = canvas.height / 2;
        // var width = window.innerWidth;
        // var height = window.innerHeight;
        // ctx.lineWidth = 1;
        // ctx.fillStyle = 'black';
        // ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
        // Create the application
        const app = new PIXI.Application({
            width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
        });
        document.body.appendChild(app.view);
        
        const container = new PIXI.Container();
        
        app.stage.addChild(container);
        
        // Create a new texture
        const texture = PIXI.Texture.from('src/app/assets/img/game_scene_background.png');
        
        // Create a 5x5 grid of bunnies
        for (let i = 0; i < 25; i++) {
            const bunny = new PIXI.Sprite(texture);
            bunny.anchor.set(0.5);
            bunny.x = (i % 5) * 40;
            bunny.y = Math.floor(i / 5) * 40;
            container.addChild(bunny);
        }
        
        // Move container to the center
        container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;
        
        // Center bunny sprite in local container coordinates
        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;
        
        // Listen for animate update
        app.ticker.add((delta) => {
            // rotate the container!
            // use delta to create frame-independent transform
            container.rotation -= 0.01 * delta;
        });
        
        // app = new PIXI.Application(900, 900); //создае холст
        // document.body.appendChild(app.view); //выводим его в тело страницы
    },
    // drawCircle: function() {
    //     var rand = Math.floor(Math.random() * colors.length); //генерим рандомное число(в промежутке от 0 до количества цветов в массиве цветов)
    //     var radius = 50; //радиус круга
    //     var inAreaX = width - 100; //возможные координаты по оси X, которые может занимать круг, ширина страницы минус его диаметр
    //     var circleY = -50; //круг должен создаваться за пределами холста
    //     var circleX = Math.floor(Math.random() * inAreaX);
    //     var circle = new PIXI.Graphics(); //создаем новый графический элемент
    //     circle.lineStyle(0); //начинаем рисовать
    //     circle.beginFill(colors[rand], 1); //задаем рандомный цвет
    //     circle.drawCircle(circleX, circleY, radius); //рисуем кружок, ведь он наш дружок
    //     circle.endFill(); //закончили отрисовку
    //     circle.interactive = true; //делаем круг интерактивным
    //     circle.buttonMode = true; //меняем курсор при наведении
    //     circle.live = true; //указываем что наш шарик жив и не пал жертвой выстрела
    //     figuresAmount++;
    //     circle.num = figuresAmount; //даем нашему кругу порядковый номер
    //     figure.push(circle); //обратиться на прямую к объекту circle мы не можем, поэтому отправляем его в массив
    //     app.stage.addChild(circle); //выводим круг на холсте
    //     circle.on('pointerdown', controller.clearFigure); //добавляем возможность при клике на фигуру удалить её
    // },
    // gameOver: function() {
    //     var style = new PIXI.TextStyle({ //стили для текста
    //         fill: '0xffffff',
    //         fontSize: 36,
    //     }); 
    //     var gameOverText = new PIXI.Text('Game Over', style); //собственно выводимый текст
    //     gameOverText.x = width / 2; //центрируем относительно экрана
    //     gameOverText.y = height / 2; //центрируем относительно экрана
    //     gameOverText.pivot.x = 50; //выравниваем по оси х
    //     gameOverText.pivot.y = 50; // выравниваем по оси y
    //     app.stage.addChild(gameOverText); //выводим на холсте
    // }
}
var view = {
    loadGame: function() {
        model.createCanvas();
        // model.drawCircle();
        
        // setInterval(model.drawCircle, 500);

        // app.ticker.add(function() { //постоянное обновление холста
        //     for (var i = 0; i < figuresAmount; i++) {
        //         figure[i].position.y += gravity; //заставляем гравитацию работать
        //         if (figure[i].position.y > height && figure[i].live == true) {
        //             model.gameOver();
        //             return false;
        //         }

        //     }
        // });
    }
}


// var controller = {
//     clearFigure: function() {
//         this.clear();
//         figure[this.num].live = false;

//     }
// }

view.loadGame();



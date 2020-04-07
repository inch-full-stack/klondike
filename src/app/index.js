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

        // document.body.appendChild(app.view);

        // var windowWight = 1280;
        // var windowHeight = 720;

        // app.renderer.resize(windowWight, windowHeight);

        // console.log(windowWight, " ", windowHeight);

        // app.renderer.backgroundColor = 0x061639;


    },

    LoadingNewImage: function(){
        //Create the background Image
        var app = new PIXI.Application({
            width: 256,
            height: 256,
            antialiasing: true,
            transparent: false,
            resolution: 1
          }
        );
        console.log("!");
        const texture = PIXI.Texture.from('app/assets/img/game_scene_background.png');
        console.log("texture", texture)
        var cat = new PIXI.Sprite(texture);


        cat.anchor.set(0.5);
        cat.x = app.width;
        cat.y = app.height;

        console.log("cat", cat)
        app.stage.addChild(cat);
        console.log("app.stage", app.stage)

    }
}
var view = {
    loadGame: function() {
        model.createCanvas();
        model.LoadingNewImage();
    }
}


// var controller = {
//     clearFigure: function() {
//         this.clear();
//         figure[this.num].live = false;

//     }
// }

view.loadGame();



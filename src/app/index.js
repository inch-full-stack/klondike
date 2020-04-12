const PIXI = require('pixi.js');
window.PIXI = PIXI;
const tweenManager = require('pixi-tween');
require('pixi-layers');
import Sound from 'pixi-sound';

var templateWidth = 1280;
var templateHeight = 720;

var functionState = 0;
var lastFunctionState = -1;

var _width = window.innerWidth;
var _height = window.innerHeight;

const ticker = new PIXI.Ticker();

var containerForGardenbed = new PIXI.Container(),
    containerForCow = new PIXI.Container(),
    conteinerForMilkman = new PIXI.Container(),
    conteinerGreenButtonWithText = new PIXI.Container(),
    containerForEndWindow = new PIXI.Container();

var massOfActionSpace = [containerForGardenbed, containerForCow, conteinerForMilkman];

var myBG, myLogo, finger, itemsBG, ShapeBG, SuccessBG, barrelForHouse, smokeForHouse, // переменные типа спрайт
    spawnX, spawnY, lastPosX, lastPosY, // переменные для работы с мышью
    endTextFirst, endTextSecond, // переменные типа текст для финального окна
    teplateDistanceForFinger, timeOfAnimationForFinger; // переменные для рассчета скорости перемещения пальца

var resourcesFromItems = [],
    itemsForUse = [],
    questionMarks = [],
    questionMarksAllow = [],
    usedTool = [],
    itemInactive = [],
    itemActive = [],
    maskOfActiveItems = [],
    textureForCows = [],
    textureForSmokes = [],
    textureForBarrels = [];

const soundSuccess = Sound.add('audio', 'app/assets/sounds/success.mp3'), // звуковые дорожки
    soundFail = Sound.add('audio', 'app/assets/sounds/fail.mp3'),
    soundEnd_card = Sound.add('audio', 'app/assets/sounds/end_card.mp3'),
    soundMain = Sound.add('audio', 'app/assets/sounds/maintheme.mp3');

// * параметры для текста в зеленой кнопке
const styleForButton = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    align: 'center'
});

// * параметры для первой строки текста в финальном окне
const styleForEndTextFirst = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 26,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    align: 'center'
});

// * параметры для второй строки текста в финальном окне
const styleForEndTextSecond = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'],
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    align: 'center'
});

// * создание главного окна и его параметры
var app = new PIXI.Application({
    width: _width / 1.012,
    height: _height / 1.05,
    antialiasing: true,
    transparent: false,
    resolution: window.devicePixelRatio,
    autoDensity: true
});

document.body.appendChild(app.view); // добавление главного окна на страницу

// ? адаптивность окна
function appResize(){
    _width = window.innerWidth / 1.012;
    _height = window.innerHeight / 1.05;
    app.renderer.resize(_width, _height);
};

function loadAllImages(){
    loadBG();
    loadMilkman();
    loadGardenbed();
    loadCows();
    loadRightPanel();
    loadFinger();
    loadGreenButton();
    loadLogo();
};

function loadGardenbed(){
    let textureForGardenbed = PIXI.Texture.from('app/assets/raw/gardenbed.png');
    let textureForWheat = PIXI.Texture.from('app/assets/raw/wheat_1.png');

    let startPosX = 0;
    let startPosY = 0;

    let buffItems1 = [];
    let buffItems2 = [];

    // добавление пшеницы и клумб на страницу, добавление спрайтов
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 2; i++) {
            let gardenbed = new PIXI.Sprite(textureForGardenbed);
            let wheat = new PIXI.Sprite(textureForWheat);

            gardenbed.anchor.set(0.5);
            wheat.anchor.set(0.5);

            gardenbed.x = startPosX - (i * 53) + ((j - 1) * 63);
            gardenbed.y = startPosY - (i * 33) - ((j - 1) * 35);

            wheat.x = startPosX - (i * 53) + ((j - 1) * 63);
            wheat.y = startPosY - 30 - (i * 33) - ((j - 1) * 35);

            buffItems1.push(gardenbed);
            buffItems2.push(wheat);
        }
    }

    // добавление элементов в обратном порядке (для правильной прорисовки слоев)
    for (let i = 5; i >= 0; i--) {
        containerForGardenbed.addChild(buffItems1[i]);
        containerForGardenbed.addChild(buffItems2[i]);
    }

    containerForGardenbed.x = app.renderer.width / 2.7;
    containerForGardenbed.y = app.renderer.height / 1.1;

    app.stage.addChild(containerForGardenbed);
};

function loadCows(){
    let textureForCowAll = new PIXI.Texture.from("app/assets/animations/cows.png");
    let textureForCowShadowAll = new PIXI.Texture.from("app/assets/raw/shadow.png");

    // добавление тектур коров из одной картинки
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 3; i++) {
            var textureForCow = new PIXI.Texture(textureForCowAll, new PIXI.Rectangle(96 * j, 90 * i, 96, 89));

            if ((i + 1)*(j * 1) != 6) {
                textureForCows.push(textureForCow);
            }
        }
    }

    let startPosX = 0;
    let startPosY = 0;

    // добавление коров на страницу
    for (let i = 0; i < 3; i++) {
        let cow = new PIXI.Sprite(textureForCows[0]);
        let cowShadow = new PIXI.Sprite(textureForCowShadowAll);

        cow.anchor.set(0.5);
        cowShadow.anchor.set(0.5);

        if (i == 2) {
            startPosX = ((i - 1) * 170);
            startPosY = -20;
        }

        if (i != 1) { // отзеркаливает 2 корову
            cow.scale.x *= -1;
        }

        cow.x = startPosX - (i * 70);
        cow.y = startPosY + (i * 70);

        cowShadow.x = (startPosX + 5) - (i * 70);
        cowShadow.y = (startPosY + 20) + (i * 70);


        containerForCow.addChild(cowShadow);
        containerForCow.addChild(cow);

        containerForCow.x = app.renderer.width / 1.6;
        containerForCow.y = app.renderer.height / 1.6;

        app.stage.addChild(containerForCow);
    }
};

function loadSmokeAndBarrelForHouse(){
    let textureForBarrelAll = new PIXI.Texture.from("app/assets/animations/barrel.png");
    let textureForSmokeAll = new PIXI.Texture.from("app/assets/animations/smoke.png");

    // заполнение масива текстур из одной картинки для анимации бочки
    for(let j = 0; j < 3; j++){
        for(let i = 0; i < 3; i++){
            let textureForBarrel = new PIXI.Texture(textureForBarrelAll, new PIXI.Rectangle(42 * j, 44 * i, 41, 45));
            textureForBarrels.push(textureForBarrel);
        }
    }

    // заполнение масива текстур из одной картинки для анимации дыма
    for(let j = 0; j < 5; j++){
        for(let i = 0; i < 3; i++){
            let textureForSmoke = new PIXI.Texture(textureForSmokeAll, new PIXI.Rectangle(40 * j, 61 * i, 39, 60));
            textureForSmokes.push(textureForSmoke);
        }
    }

    barrelForHouse = new PIXI.Sprite(textureForBarrels[0]);
    smokeForHouse = new PIXI.Sprite(textureForSmokeAll[0]);

    barrelForHouse.anchor.set(0.5);
    smokeForHouse.anchor.set(0.5);

    barrelForHouse.x = conteinerForMilkman.x + 5;
    barrelForHouse.y = conteinerForMilkman.y + 32;

    smokeForHouse.x = conteinerForMilkman.x + 21;
    smokeForHouse.y = conteinerForMilkman.y - 143;

    app.stage.addChild(barrelForHouse);
    app.stage.addChild(smokeForHouse);
};

// ? анимация бочки
function startChangingBarrelSpriteAnim(item, max, time, startTexture){
    let tweenChangingBarrelAnim = PIXI.tweenManager.createTween(item);
    tweenChangingBarrelAnim.time = time;
    tweenChangingBarrelAnim.repeat = max;
    tweenChangingBarrelAnim.on('repeat', ( loopCount ) => {
        item.texture = startTexture[loopCount];
    });
    tweenChangingBarrelAnim.on('end', () => {
        item.texture = startTexture[0];
    });
    tweenChangingBarrelAnim.start();
};

// ? анимация дыма на домике
function startChangingSmokeSpriteAnim(item, max, time, startTexture){
    let tweenChangingSmokeAnim = PIXI.tweenManager.createTween(item);
    tweenChangingSmokeAnim.time = time;
    tweenChangingSmokeAnim.repeat = max;
    tweenChangingSmokeAnim.on('repeat', ( loopCount ) => {
        item.texture = startTexture[loopCount];
    });
    tweenChangingSmokeAnim.on('end', () => {
        item.texture = startTexture[0];
        loadDarkBGForEndWindow();
    });
    tweenChangingSmokeAnim.start();
};

// ? запуск анимации для коров с определенным промежутком времени
function startCowAnim(item, max, time){
    let tweenCowAnim = PIXI.tweenManager.createTween(item);
    tweenCowAnim.time = time;
    tweenCowAnim.repeat = max;
    tweenCowAnim.on('repeat', ( loopCount ) => {
        startChangingCowSpriteAnim(item.getChildAt(item.children.length - loopCount * 2 + 1), textureForCows.length - 2, 300);
    });
    tweenCowAnim.start();
};

// ? анимация одной коровы
function startChangingCowSpriteAnim(item, max, time){
    let tweenChangingCowAnim = PIXI.tweenManager.createTween(item);
    tweenChangingCowAnim.time = time;
    tweenChangingCowAnim.repeat = max;
    tweenChangingCowAnim.on('repeat', ( loopCount ) => {
        item.texture = textureForCows[loopCount];
    });
    tweenChangingCowAnim.on('end', () => {
        item.texture = textureForCows[0];
    });
    tweenChangingCowAnim.start();
};

// ? создание спрайта "неверного выбора"
function loadCanselAction(posX, posY){
    let containerForCanselAction = new PIXI.Container();
    let textureForCanselActionEllipse = PIXI.Texture.from('app/assets/raw/ellipse_1.png');
    let textureForCanselActionX = PIXI.Texture.from('app/assets/raw/x.png');

    let canselActionEllipse = new PIXI.Sprite(textureForCanselActionEllipse);
    let canselActionX = new PIXI.Sprite(textureForCanselActionX);

    canselActionEllipse.anchor.set(0.5);
    canselActionX.anchor.set(0.5);

    containerForCanselAction.addChild(canselActionEllipse);
    containerForCanselAction.addChild(canselActionX);

    app.stage.addChild(containerForCanselAction);
    containerForCanselAction.visible = false;

    containerForCanselAction.x = posX;
    containerForCanselAction.y = posY;

    return containerForCanselAction;
};

// ? загрузка спрайта заднего фона
function loadBG(){
    let textureForBG = PIXI.Texture.from('app/assets/img/game_scene_background.png');
    myBG = new PIXI.Sprite(textureForBG);

    myBG.anchor.set(0.5);

    myBG.x = app.renderer.width / 2;
    myBG.y = app.renderer.height / 1.6;

    myBG.width = app.renderer.width;
    myBG.height = app.renderer.height * 3.5;

    app.stage.addChild(myBG);
};

// ? загрузка спрайта логотипа
function loadLogo(){
    let textureLogo = PIXI.Texture.from('app/assets/raw/logo.png');
    myLogo = new PIXI.Sprite(textureLogo);

    myLogo.anchor.set(0.5);

    myLogo.x = app.renderer.width / 6;
    myLogo.y = app.renderer.height / 8;

    app.stage.addChild(myLogo);
};

// ? загрузка спрайта домика
function loadMilkman(){
    let textureOfMilkman = PIXI.Texture.from('app/assets/raw/milkman.png');
    let milkman = new PIXI.Sprite(textureOfMilkman);

    milkman.anchor.set(0.5);

    conteinerForMilkman.addChild(milkman);

    conteinerForMilkman.pivot.x = conteinerForMilkman.width / 2;
    conteinerForMilkman.pivot.y = conteinerForMilkman.height / 2;

    conteinerForMilkman.x = app.renderer.width / 2.15;
    conteinerForMilkman.y = app.renderer.height / 2.9;

    app.stage.addChild(conteinerForMilkman);
};

// ? загрузка спрайта боковой панели и ее элементов
function loadRightPanel(){
    let textureItemsBG = PIXI.Texture.from('app/assets/raw/tools_background.png'),
        textureForItemInactive = PIXI.Texture.from('app/assets/raw/tool_inactive_base.png'),
        textureForItemActive = PIXI.Texture.from('app/assets/raw/tool_active_base.png'),
        textureForQuestionmark = PIXI.Texture.from('app/assets/raw/questionmark.png'),
        textureForUsedTool = PIXI.Texture.from('app/assets/raw/tool_used.png'),
        textureForQuestionmarkAllow = PIXI.Texture.from('app/assets/raw/tool_unknown.png');

    for(let i = 0; i < 3; i++){
        let textureForResources;

        if(i != 2){
            textureForResources = PIXI.Texture.from('app/assets/raw/resource_' + (i + 1) + '.png');
        } else {
            textureForResources = PIXI.Texture.from('app/assets/raw/cheese.png');
        }

        resourcesFromItems.push(new PIXI.Sprite(textureForResources));
        resourcesFromItems[i].anchor.set(0.5);
        resourcesFromItems[i].visible = false;
    }

    for(let i = 0; i < 3; i++){
        let textureForTools = PIXI.Texture.from('app/assets/raw/tool_' + (i + 1) + '.png');
        itemsForUse.push(new PIXI.Sprite(textureForTools));
    }

    for(let i = 0; i < 3; i++){
        questionMarks.push(new PIXI.Sprite(textureForQuestionmark));
    }

    for(let i = 0; i < 3; i++){
        questionMarksAllow.push(new PIXI.Sprite(textureForQuestionmarkAllow));
    }

    for(let i = 0; i < 3; i++){
        usedTool.push(new PIXI.Sprite(textureForUsedTool));
    }

    for(let i = 0; i < 3; i++){
        itemInactive.push(new PIXI.Sprite(textureForItemInactive));
        itemActive.push(new PIXI.Sprite(textureForItemActive));
    }

    for(let i = 0; i < 3; i++){
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0xDE3249);
        graphics.drawRect(itemActive[i].x, itemActive[i].y, 150, 150);
        graphics.endFill();
        maskOfActiveItems.push(graphics);
    }

    itemsBG = new PIXI.Sprite(textureItemsBG)

    itemsBG.anchor.set(0.5);

    itemsBG.x = app.renderer.width / 1.1;
    itemsBG.y = app.renderer.height / 1.9;

    itemsBG.width = app.renderer.width / 8;
    itemsBG.height = app.renderer.height * 1;

    for(let i = 0; i < itemActive.length; i++){
        itemInactive[i].anchor.set(0.5);
        itemActive[i].anchor.set(0.5);
        itemsForUse[i].anchor.set(0.5);
        questionMarks[i].anchor.set(0.5);
        questionMarksAllow[i].anchor.set(0.5);
        usedTool[i].anchor.set(0.5);

        maskOfActiveItems[i].pivot.x = maskOfActiveItems[i].width / 2;
        maskOfActiveItems[i].pivot.y = maskOfActiveItems[i].height;

        let buffItemsBGY = 1.0;

        let positionX = itemsBG.x;
        let positionY = ((itemsBG.y * buffItemsBGY + itemsBG.y / 3) / 3) + (itemsBG.y / 2) * (i);

        itemInactive[i].x = positionX;
        itemInactive[i].y = positionY;

        itemActive[i].x = positionX;
        itemActive[i].y = positionY;

        questionMarks[i].x = positionX;
        questionMarks[i].y = positionY;

        questionMarksAllow[i].x = positionX;
        questionMarksAllow[i].y = positionY;

        itemsForUse[i].x = positionX;
        itemsForUse[i].y = positionY;

        usedTool[i].x = positionX;
        usedTool[i].y = positionY;

        maskOfActiveItems[i].x = positionX;
        maskOfActiveItems[i].y = positionY + maskOfActiveItems[i].width / 2;
    }

    app.stage.addChild(itemsBG);

    // добавление элементов для боковой панели на страницу
    for (let i = 0; i < itemActive.length; i++) {
        app.stage.addChild(itemInactive[i]);
        app.stage.addChild(itemActive[i]);
        itemActive[i].visible = false;
        app.stage.addChild(questionMarks[i]);
        app.stage.addChild(questionMarksAllow[i]);
        questionMarksAllow[i].visible = false;
        app.stage.addChild(usedTool[i]);
        usedTool[i].visible = false;
        app.stage.addChild(maskOfActiveItems[i]);

        itemActive[i].mask = maskOfActiveItems[i];
        questionMarksAllow[i].mask = maskOfActiveItems[i];
    }

    for (let i = 0; i < itemActive.length; i++) {
        app.stage.addChild(itemsForUse[i]);
    }
};

// ? анимация загрузки появившихся элементов боковой панели
function startOpeningNewItem(item, time){
    let tweenGraphicAnim = PIXI.tweenManager.createTween(item);
    tweenGraphicAnim.from({ height: 0 }).to({ height: item.height })
    tweenGraphicAnim.time = time;
    tweenGraphicAnim.repeat = 0;

    tweenGraphicAnim.start();
};

// ? загрузка зеленой кнопки с текстом
function loadGreenButton(){
    let textureForGreenButton = PIXI.Texture.from('app/assets/raw/button_green.png');
    let greenButton = new PIXI.Sprite(textureForGreenButton);
    let richText = new PIXI.Text('Установить', styleForButton);

    greenButton.anchor.set(0.5);

    conteinerGreenButtonWithText.addChild(greenButton);

    richText.pivot.x = richText.width / 2;
    richText.pivot.y = richText.height / 2;

    conteinerGreenButtonWithText.pivot.x = conteinerGreenButtonWithText.width / 2;
    conteinerGreenButtonWithText.pivot.y = conteinerGreenButtonWithText.height / 2

    conteinerGreenButtonWithText.x = app.renderer.width / 10;
    conteinerGreenButtonWithText.y = app.renderer.height / 1.1;

    richText.x = 0; //conteinerGreenButtonWithText.x;
    richText.y = 0; //conteinerGreenButtonWithText.y;

    conteinerGreenButtonWithText.addChild(richText);

    app.stage.addChild(conteinerGreenButtonWithText);
};

// ? загрузка пальца
function loadFinger(){
    let textureForFinger = PIXI.Texture.from('app/assets/raw/finger.png');

    finger = new PIXI.Sprite(textureForFinger);
    finger.anchor.set(0.2);

    app.stage.addChild(finger);
};

// ? загрузка черного заднего фона для финального окна
function loadDarkBGForEndWindow(){
    let graphic = new PIXI.Graphics()
        .beginFill(0x000000, 0.8)
        .drawRect(0, 0, app.renderer.width, app.renderer.width)
        .endFill();

    let texture = app.renderer.generateTexture(graphic, PIXI.SCALE_MODES.NEAREST, 1, graphic);
    let blackBG = new PIXI.Sprite(texture);

    app.stage.addChild(blackBG);

    startEndWindowAnimAlpha(blackBG, 0, 1, 500);
};

// ? загрузка спрайтов для финального окна
function loadEndWindow(){
    let textureForShapeBG = PIXI.Texture.from('app/assets/raw/shape288.png');
    let textureForSuccessBG = PIXI.Texture.from('app/assets/raw/success_background.png');

    ShapeBG = new PIXI.Sprite(textureForShapeBG);
    SuccessBG = new PIXI.Sprite(textureForSuccessBG);

    ShapeBG.anchor.set(0.5);
    SuccessBG.anchor.set(0.5);

    ShapeBG.scale.x = 1.7;
    ShapeBG.scale.y = 1.7;

    SuccessBG.width = templateWidth / 3;
    SuccessBG.height = templateHeight / 2;

    startEnding();
};

// ? определение поведения мыши
function workWithItemsForUse(item){
    if(functionState < itemActive.length){
        item
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);
    }
};

// ? настройка элементов боковой панели относительно functionState
function logicOfMovementItems(item){
    workWithItemsForUse(item);
    if(functionState == 0){
        item.interactive = true;
        item.buttonMode = true;
        itemActive[functionState].visible = true;
        for(let i = 0; i < itemInactive.length; i++){
            if(i > functionState){
                itemsForUse[i].visible = false;
                questionMarks[i].visible = true;
            } else if(i < functionState){
                questionMarks[i].visible = false;
            } else {
                itemsForUse[i].visible = true;
                questionMarks[i].visible = false;
            }
        }
    }
};

// ? действие при нажатии мыши
function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    spawnX = this.x;
    spawnY = this.y;
};

// ? действие, когда отпускаешь мышь
function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
    let radiusOfAction = 150;

    if(Math.sqrt(Math.pow((massOfActionSpace[functionState].x - lastPosX), 2) + Math.pow((massOfActionSpace[functionState].y - lastPosY), 2)) <= radiusOfAction){
        soundSuccess.play();
        trueVerOfStateLogic();
    }
    else {
        let buffInt = 0;
        for(let i = 0; i < massOfActionSpace.length; i++){
            if(i != functionState){
                if(Math.sqrt(Math.pow((massOfActionSpace[i].x - lastPosX), 2) + Math.pow((massOfActionSpace[i].y - lastPosY), 2)) <= radiusOfAction){
                    buffInt++;
                }
            }
        }
        if(massOfActionSpace.length - 2 == buffInt){
            soundFail.play();
            startCanselScaleAnim(loadCanselAction(lastPosX, lastPosY), 0, 1, 500, 'start');
        }
        this.x = spawnX;
        this.y = spawnY;
    }
};

// ? действие при движении мыши
function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
        lastPosX = newPosition.x;
        lastPosY = newPosition.y;
    }
};

function trueVerOfStateLogic(){
    itemsForUse[functionState].visible = false;
    usedTool[functionState].visible = true;

    if (functionState + 1 != itemActive.length) {
        // TODO запускается анимация перемещения элементов на боковую панель(пшеницы, молока)
        startWaitingAnimForUseItems(300, massOfActionSpace[functionState], functionState, itemInactive[functionState + 1].x, itemInactive[functionState + 1].y);
    }
    if (functionState == 1) {
        // TODO запуск анимации коров
        startCowAnim(containerForCow, containerForCow.children.length / 2, 200);
    } else if (functionState == 2) {
        // TODO запуск анимации домика(дым, бочка)
        loadSmokeAndBarrelForHouse();
        startChangingBarrelSpriteAnim(barrelForHouse, textureForBarrels.length - 2, 300, textureForBarrels);
        startChangingSmokeSpriteAnim(smokeForHouse, textureForSmokes.length - 2, 300, textureForSmokes);;
    }

    functionState++;
};

// ? анимация "неверного выбора"
function startCanselScaleAnim(item, startScale, finishScale, time, state) {
    let tweenCanselAnim = PIXI.tweenManager.createTween(item);
    tweenCanselAnim.from({ scale : {x: startScale, y: startScale } }).to({ scale : {x: finishScale, y: finishScale } })
    tweenCanselAnim.time = time;
    tweenCanselAnim.repeat = 0;
    tweenCanselAnim.on('start', () => {
        item.visible = true;
    });
    tweenCanselAnim.on('end', () => {
        if(state == 'start'){
            startWaitingAnimForCansel(item, 500, 0);
        }
    });
    tweenCanselAnim.start();
};

// ? дополнительная анимация "неверного выбора"
function startWaitingAnimForCansel(item, time, max){
    let tweenCanselWait = PIXI.tweenManager.createTween(item);
    tweenCanselWait.time = time;
    tweenCanselWait.repeat = max;
    tweenCanselWait.on('end', () => {
        startCanselScaleAnim(item, 1, 0, 500, 'end');
    });
    tweenCanselWait.start();
};

// ? добавление текста для финального окна
function loadEndText(){
    endTextFirst = new PIXI.Text('Отличная работа!', styleForEndTextFirst);
    endTextSecond = new PIXI.Text('Установите,\n чтобы продолжить!', styleForEndTextSecond);

    endTextFirst.anchor.set(0.5);
    endTextSecond.anchor.set(0.5);

    endTextFirst.x = 0;
    endTextFirst.y = -app.renderer.height / 4;

    endTextSecond.x = 0;
    endTextSecond.y = app.renderer.height / 6;

    app.stage.addChild(endTextFirst);
    app.stage.addChild(endTextSecond);
};

// ? анимация черного заднего фона для финального окна
function startEndWindowAnimAlpha(item, alphaStart, alphaEnd, time) {
    soundEnd_card.play();

    let tweenEndWindowAnim = PIXI.tweenManager.createTween(item);
    tweenEndWindowAnim.from({ alpha: alphaStart }).to({ alpha: alphaEnd })
    tweenEndWindowAnim.time = time;
    tweenEndWindowAnim.repeat = 0;

    tweenEndWindowAnim.on('end', () => {
        loadEndWindow();
    });

    tweenEndWindowAnim.start();
};

// ? настройка финального окна
function startEnding(){
    resourcesFromItems[2].visible = true;

    conteinerGreenButtonWithText.x = 0;
    conteinerGreenButtonWithText.y = app.renderer.height / 3.0;

    resourcesFromItems[2].x = 0;
    resourcesFromItems[2].y = -app.renderer.height / 16; // не баг, а фича :)

    myLogo.x = 0;
    myLogo.y = -app.renderer.height / 2.5; // не баг, а фича :)

    myLogo.scale.x = 0.65;
    myLogo.scale.y = 0.65;

    conteinerGreenButtonWithText.scale.x = 0.85;
    conteinerGreenButtonWithText.scale.y = 0.85;

    resourcesFromItems[2].scale.x = 0.8;
    resourcesFromItems[2].scale.y = 0.8;

    loadEndText();

    containerForEndWindow.addChild(ShapeBG);
    containerForEndWindow.addChild(SuccessBG);
    containerForEndWindow.addChild(resourcesFromItems[2]);
    containerForEndWindow.addChild(conteinerGreenButtonWithText);
    containerForEndWindow.addChild(myLogo);
    containerForEndWindow.addChild(endTextFirst);
    containerForEndWindow.addChild(endTextSecond);

    containerForEndWindow.x = app.renderer.width / 2;
    containerForEndWindow.y = app.renderer.height / 2;

    app.stage.addChild(containerForEndWindow);

    startEndWindowAnim(containerForEndWindow, 0, 1, 1000);
};

// ? анимация финального окна
function startEndWindowAnim(item, startScale, finishScale, time) {
    let tweenEndWindowAnim = PIXI.tweenManager.createTween(item);
    tweenEndWindowAnim.from({ scale : {x: startScale, y: startScale } }).to({ scale : {x: finishScale, y: finishScale } })
    tweenEndWindowAnim.time = time;
    tweenEndWindowAnim.repeat = 0;

    tweenEndWindowAnim.start();
};

function startWaitingAnimForUseItems(time, parent, functionState, secondFinX, secondFinY){
    let tweenItemWait = PIXI.tweenManager.createTween();

    tweenItemWait.time = time;
    tweenItemWait.repeat = parent.children.length / 2;
    tweenItemWait.on('repeat', ( loopCount ) => {
        let indexOfChild = parent.children.length / 2 - loopCount;
        let childrenPosX = parent.getChildAt(indexOfChild * 2).x / 2 + parent.x;
        let childrenPosY = parent.getChildAt(indexOfChild * 2).y / 2  + parent.y;
        startResourceInterpolation(changeWheatToResource(indexOfChild, functionState, parent),
                                    parent, indexOfChild,
                                    childrenPosX, childrenPosY, childrenPosX, childrenPosY - 70,
                                    secondFinX, secondFinY, 500, 'start');
    });

    tweenItemWait.start();
};

// ? создание предметов для анимации переноса
function changeWheatToResource(indexOfChild, indexOfResource, parent) {
    let textureForResources = PIXI.Texture.from('app/assets/raw/resource_' + (indexOfResource + 1) + '.png');
    let buff = new PIXI.Sprite.from(textureForResources);
    buff.pivot.x = buff.width / 2;
    buff.pivot.y = buff.height / 2;

    app.stage.addChild(buff);

    buff.x = parent.getChildAt(indexOfChild * 2 + 1).x;
    buff.y = parent.getChildAt(indexOfChild * 2 + 1).y;

    containerForGardenbed.getChildAt(indexOfChild * 2 + 1).visible = false;

    return buff;
}

// ? запуск анимации переноса элементов
function startResourceInterpolation(item, parent, indexOfChild, startX, startY, finishX, finishY, secondFinX, secondFinY, time, state){
    let tweenResourceWait = PIXI.tweenManager.createTween(item);
    tweenResourceWait.from({ x: startX, y: startY }, {i: 0}).to({ x: finishX, y: finishY }, {i: 10});
    tweenResourceWait.time = time;
    tweenResourceWait.repeat = 0;
    tweenResourceWait.on('end', () => {
        if (state == 'start') {
            startResourceInterpolation(item, parent, indexOfChild, finishX, finishY, secondFinX, secondFinY, -1, -1, 1500, 'end');
        } else {
            startItemScaleAnim(item, 1, 0, 100);
            if (indexOfChild + 1 == 1) {
                itemsForUse[functionState].interactive = true;
                itemsForUse[functionState].buttonMode = true;
                itemsForUse[functionState].visible = true;
                questionMarksAllow[functionState].visible = false;
            }
            if (indexOfChild + 1 == parent.children.length / 2) {
                startOpeningNewItem(maskOfActiveItems[functionState], 500);
                questionMarksAllow[functionState].visible = true;
                questionMarks[functionState].visible = false;
                itemsForUse[functionState].visible = false;
                itemActive[functionState].visible = true;
            }
        }
    });
    tweenResourceWait.start();
};

// ? анимация прилетающих элементов к боковой панели
function startItemScaleAnim(item, startScale, finishScale, time) {
    let tweenItemAnim = PIXI.tweenManager.createTween(item);
    tweenItemAnim.from({ scale : {x: startScale, y: startScale } }).to({ scale : {x: finishScale, y: finishScale } })
    tweenItemAnim.time = time;
    tweenItemAnim.repeat = 0;
    tweenItemAnim.on('end', () => {
        item.visible = true;
    });
    tweenItemAnim.start();
};

// ? фунция перерассчета времени для анимации пальца
function findTimeOfAnimationForFinger(){
    teplateDistanceForFinger = Math.sqrt(Math.pow(itemActive[0].x - massOfActionSpace[0].x, 2) + Math.pow(itemActive[0].y - massOfActionSpace[0].y, 2));
    let distanceForFinger = Math.sqrt(Math.pow(itemActive[functionState].x - massOfActionSpace[functionState].x, 2) + Math.pow(itemActive[functionState].y - massOfActionSpace[functionState].y, 2));
    let speedOfFinger = teplateDistanceForFinger / 2000;
    timeOfAnimationForFinger = distanceForFinger / speedOfFinger;
};

// ? анимация переноса пальца
function startAnimationForFinger(item, startX, startY, finishX, finishY, time){
    let tweenFinger = PIXI.tweenManager.createTween(item);
    tweenFinger.from({ x: startX, y: startY}).to({ x: finishX, y: finishY });
    tweenFinger.time = time;
    tweenFinger.repeat = 0;
    tweenFinger.on('end', ( ) => {
        changeAlphaChannel(item, 1, 0, 500, 'end', tweenFinger);
    });
    changeAlphaChannel(item, 0, 1, 500, 'start', tweenFinger);
};

// ? анимация изменения прозрачности пальца (начало, конец)
function changeAlphaChannel(item, alphaStart, alphaEnd, time, state, startAnim){
    let tweenFingerAnim = PIXI.tweenManager.createTween(item);
    tweenFingerAnim.from({ alpha: alphaStart }).to({ alpha: alphaEnd })
    tweenFingerAnim.time = time;
    tweenFingerAnim.repeat = 0;
    tweenFingerAnim.on('start', () => {
        if (state == 'start') {
            item.x = itemActive[functionState].x;
            item.y = itemActive[functionState].y;
        }
    });
    tweenFingerAnim.on('end', () => {
        if (state == 'start') {
            startAnim.start();
        } else if (state == 'end') {
            startWaitingAnimForFinger(item, 1000, 5);
        }
    });
    tweenFingerAnim.start();
};

// ? тайминг анимации пальца
function startWaitingAnimForFinger(item, time, max){
    let tweenFingerWait = PIXI.tweenManager.createTween(item);
    tweenFingerWait.time = time;
    tweenFingerWait.repeat = max;
    tweenFingerWait.on('start', () => {
        item.alpha = 0;
    });
    tweenFingerWait.on('end', () => {
        if (functionState < itemActive.length) {
            item.x = itemActive[functionState].x;
            item.y = itemActive[functionState].y;
            findTimeOfAnimationForFinger();
            startAnimationForFinger(finger, itemActive[functionState].x, itemActive[functionState].y,
                                massOfActionSpace[functionState].x, massOfActionSpace[functionState].y,
                                timeOfAnimationForFinger, 0);
        }
    });
    tweenFingerWait.start();
};

// ? анимация зеленой кнопки
function startGreenButtonAnim(item, startScale, finishScale, time, i) {
    let tweenGreenButtonAnim = PIXI.tweenManager.createTween(item);
    tweenGreenButtonAnim.from({ scale : {x: startScale, y: startScale } }).to({ scale : {x: finishScale, y: finishScale } })
    tweenGreenButtonAnim.time = time;
    tweenGreenButtonAnim.repeat = 0;
    tweenGreenButtonAnim.on('end', () => {
        if (i != 100) {
            startGreenButtonAnim(item, finishScale, startScale, time, ++i);
        }
    });
    tweenGreenButtonAnim.start();
};

// ? запуск тикера
function startFunction(){
    ticker.add(appResize);
    ticker.add(logicFunc);
    ticker.start();
};

// ? контроль состояния
function logicFunc(){
    if (functionState != itemActive.length) {
        if (lastFunctionState != functionState) {
            logicOfMovementItems(itemsForUse[functionState]);
            lastFunctionState = functionState;
        }
    } else {
        if (lastFunctionState != functionState) {
            lastFunctionState = functionState;
        }
    }
};

var view = {
    loadGame: function() {
        soundMain.play();
        soundMain.loop = true;
        loadAllImages();
        startFunction(); // вызов функции тикера
        findTimeOfAnimationForFinger(); // вызов функции перерассчета времени для анимации пальца
        startWaitingAnimForFinger(finger, 1000, 5); // вызов функции анимации пальца
        startGreenButtonAnim(conteinerGreenButtonWithText, 1.05, 0.95, 1500, 0); // вызов функции анимации зеленой кнопки

        // * вызов функции анимации пальца без задержки на старте
        //startAnimationForFinger(finger, itemActive[functionState].x, itemActive[functionState].y, massOfActionSpace[functionState].x, massOfActionSpace[functionState].y, timeOfAnimationForFinger, 0);
    }
};

app.ticker.add(function() {
    PIXI.tweenManager.update();
});

view.loadGame();
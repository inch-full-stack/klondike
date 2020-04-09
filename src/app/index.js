import * as PIXI from "pixi.js";
import * as TWEEN from '@tweenjs/tween.js';

var ourWidth = 1280;
var ourHeight = 720;

var _width = window.innerWidth;
var _height = window.innerHeight;

const ticker = new PIXI.Ticker();
const stage = new PIXI.Container();

var containerForGardenbed = new PIXI.Container();
var containerForCow = new PIXI.Container();
var conteinerForMilkman = new PIXI.Container();
var containerForCanselAction = new PIXI.Container();
var conteinerGreenButtonWithText = new PIXI.Container();

var myBG, myLogo, finger, itemsBG, ShapeBG, SuccessBG;

var resourcesFromItems = [];
var itemsForUse = [];
var questionMarks = [];
var usedTool = [];
var itemInactive = [];
var itemActive = [];

const style = new PIXI.TextStyle({
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

var functionState = 0;

var app = new PIXI.Application({
    width: _width,
    height: _height,
    antialiasing: true,
    transparent: false,
    resolution: window.devicePixelRatio,
    autoDensity: true
  }
);

document.body.appendChild(app.view);

function appResize(){
    {
        _width = window.innerWidth;
        _height = window.innerHeight;

        app.renderer.resize(_width, _height);
    }
}

function LoadAllImages(){
    loadBG();
    loadMilkman();
    loadGardenbed();
    loadCows();
    loadRightPanel();
    loadCanselAction();
    loadFinger();
    loadEndWindow();
    loadGreenButton();
    loadLogo();
}

function loadGardenbed(){
    let textureForGardenbed = PIXI.Texture.from('app/assets/raw/gardenbed.png');
    let textureForWheat = PIXI.Texture.from('app/assets/raw/wheat_1.png');

    let startPosX = 40;
    let startPosY = 40;

    for (let i = 0; i < 6; i++) {
        var gardenbed = new PIXI.Sprite(textureForGardenbed);
        var wheat = new PIXI.Sprite(textureForWheat);
        gardenbed.anchor.set(0.5);
        wheat.anchor.set(0.5);
        if(i % 3 == 0 && i != 0){
            //console.log(startPosX, " ", startPosY);
            startPosX = startPosX + 45 + (i * 60);
            startPosY = startPosY + 30 - (i * 33);
            //console.log(startPosX, " ", startPosY);
            //console.log(i);
        }
        gardenbed.x = startPosX - (i * 53);
        gardenbed.y = startPosY + (i * 33);

        wheat.x = (startPosX - 3) - (i * 53);
        wheat.y = (startPosY - 23) + (i * 23) + ((i / 3) * 23);

        console.log(wheat.y, ' ', gardenbed.y);
        containerForGardenbed.addChild(gardenbed);
        containerForGardenbed.addChild(wheat);

        //containerForGardenbed.getChildAt(1).visible = false;

        containerForGardenbed.pivot.x = containerForGardenbed.width / 2;
        containerForGardenbed.pivot.y = containerForGardenbed.height / 2;

        containerForGardenbed.x = app.renderer.width / 2.5;
        containerForGardenbed.y = app.renderer.height / 1.2;

        app.stage.addChild(containerForGardenbed);
    }
}

function loadCows(){
    let textureForCowAll = new PIXI.Texture.from("app/assets/animations/cows.png");
    let textureForCowShadowAll = new PIXI.Texture.from("app/assets/raw/shadow.png");
    console.log(textureForCowAll);

    for(let j = 0; j < 2; j++){
        for(let i = 0; i < 3; i++){
            let textureForCow = new PIXI.Texture(textureForCowAll, new PIXI.Rectangle(96 * j, 90 * i, 96, 89));

            if((i + 1)*(j * 1) != 6){
                textureForCows.push(textureForCow);
            }
        }
    }

    let startPosX = 40;
    let startPosY = 40;

    for (let i = 0; i < 3; i++) {
        const cow = new PIXI.Sprite(textureForCows[0]);
        var cowShadow = new PIXI.Sprite(textureForCowShadowAll);
        cow.anchor.set(0.5);
        cowShadow.anchor.set(0.5);
        if(i == 2){
            startPosX = ((i - 1) * 230);
            startPosY = -10;
        }
        cow.x = startPosX - (i * 70);
        cow.y = startPosY + (i * 70);

        cowShadow.x = (startPosX + 5) - (i * 70);
        cowShadow.y = (startPosY + 20) + (i * 70);

        if(i != 1){
            cow.scale.x *= -1;
        }
        containerForCow.addChild(cowShadow);
        containerForCow.addChild(cow);

        containerForCow.pivot.x = containerForCow.width / 2;
        containerForCow.pivot.y = containerForCow.height / 2;

        containerForCow.x = app.renderer.width / 1.5;
        containerForCow.y = app.renderer.height / 1.2;

        app.stage.addChild(containerForCow);
    }
}

function loadCanselAction(){
    let textureForCanselActionEllipse = PIXI.Texture.from('app/assets/raw/ellipse_1.png');
    let textureForCanselActionX = PIXI.Texture.from('app/assets/raw/x.png');

    var canselActionEllipse = new PIXI.Sprite(textureForCanselActionEllipse);
    var canselActionX = new PIXI.Sprite(textureForCanselActionX);
    canselActionEllipse.anchor.set(0.5);
    canselActionX.anchor.set(0.5);

    containerForCanselAction.addChild(canselActionEllipse);
    containerForCanselAction.addChild(canselActionX);

    containerForCanselAction.pivot.x = containerForCanselAction.width / 2;
    containerForCanselAction.pivot.y = containerForCanselAction.height / 2

    containerForCanselAction.x = app.renderer.width / 2;
    containerForCanselAction.y = app.renderer.height / 1.1;

    app.stage.addChild(containerForCanselAction);
    containerForCanselAction.visible = false;
}

function loadBG(){
    let textureForBG = PIXI.Texture.from('app/assets/img/game_scene_background.png');
    myBG = new PIXI.Sprite(textureForBG);

    myBG.anchor.set(0.5);

    myBG.x = app.renderer.width / 2;
    myBG.y = app.renderer.height / 1.6;

    myBG.width = app.renderer.width;
    myBG.height = app.renderer.height * 3.5;

    app.stage.addChild(myBG);
}

function loadLogo(){
    let textureLogo = PIXI.Texture.from('app/assets/raw/logo.png');
    myLogo = new PIXI.Sprite(textureLogo);

    myLogo.anchor.set(0.5);

    myLogo.x = app.renderer.width / 6;
    myLogo.y = app.renderer.height / 8;

    app.stage.addChild(myLogo);
}

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
}

function loadRightPanel(){
    let textureItemsBG = PIXI.Texture.from('app/assets/raw/tools_background.png');
    let textureForItemInactive = PIXI.Texture.from('app/assets/raw/tool_inactive_base.png');
    let textureForItemActive = PIXI.Texture.from('app/assets/raw/tool_active_base.png');
    let textureForQuestionmark = PIXI.Texture.from('app/assets/raw/questionmark.png');
    let textureForUsedTool = PIXI.Texture.from('app/assets/raw/tool_used.png');

    for(let i = 0; i < 3; i++){
        let textureForResources;
        if(i != 2){
            textureForResources = PIXI.Texture.from('app/assets/raw/resource_' + (i + 1) + '.png');
        } else {
            textureForResources = PIXI.Texture.from('app/assets/raw/cheese.png');
        }
        resourcesFromItems.push(new PIXI.Sprite(textureForResources));
    }

    for(let i = 0; i < 3; i++){
        let textureForTools = PIXI.Texture.from('app/assets/raw/tool_' + (i + 1) + '.png'); 
        itemsForUse.push(new PIXI.Sprite(textureForTools));
    }

    for(let i = 0; i < 3; i++){
        questionMarks.push(new PIXI.Sprite(textureForQuestionmark));
    }

    for(let i = 0; i < 3; i++){
        usedTool.push(new PIXI.Sprite(textureForUsedTool));
    }

    for(let i = 0; i < 3; i++){
        itemInactive.push(new PIXI.Sprite(textureForItemInactive));
        itemActive.push(new PIXI.Sprite(textureForItemActive));
    }

    itemsBG = new PIXI.Sprite(textureItemsBG);

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
        usedTool[i].anchor.set(0.5);

        let buffItemsBGY = 1.0;

        itemInactive[i].x = itemsBG.x;
        itemInactive[i].y = ((itemsBG.y * buffItemsBGY + itemsBG.y / 3) / 3) + (itemsBG.y / 2) * (i);
        itemActive[i].x = itemsBG.x;
        itemActive[i].y = ((itemsBG.y * buffItemsBGY + itemsBG.y / 3) / 3) + (itemsBG.y / 2) * (i);

        questionMarks[i].x = itemsBG.x;
        questionMarks[i].y = ((itemsBG.y * buffItemsBGY + itemsBG.y / 3) / 3) + (itemsBG.y / 2) * (i);

        itemsForUse[i].x = itemsBG.x;
        itemsForUse[i].y = ((itemsBG.y * buffItemsBGY + itemsBG.y / 3) / 3) + (itemsBG.y / 2) * (i);

        usedTool[i].x = itemsBG.x;
        usedTool[i].y = ((itemsBG.y * buffItemsBGY + itemsBG.y / 3) / 3) + (itemsBG.y / 2) * (i);
    }

    app.stage.addChild(itemsBG);

    for(let i = 0; i < resourcesFromItems.length; i++){
        app.stage.addChild(resourcesFromItems[i]);
    }

    for(let i = 0; i < itemActive.length; i++){
        app.stage.addChild(itemInactive[i]);
        app.stage.addChild(itemActive[i]);
        itemActive[i].visible = false;
        app.stage.addChild(questionMarks[i]);
        app.stage.addChild(itemsForUse[i]);
        //itemsForUse[i].visible = false;
        app.stage.addChild(usedTool[i]);
        usedTool[i].visible = false;
    }
}

function loadGreenButton(){

    let textureForGreenButton = PIXI.Texture.from('app/assets/raw/button_green.png');
    let greenButton = new PIXI.Sprite(textureForGreenButton);
    greenButton.anchor.set(0.5);

    conteinerGreenButtonWithText.addChild(greenButton);

    let richText = new PIXI.Text('Установить', style);
    richText.pivot.x = richText.width / 2;
    richText.pivot.y = richText.height / 2;

    conteinerGreenButtonWithText.pivot.x = conteinerGreenButtonWithText.width / 2;
    conteinerGreenButtonWithText.pivot.y = conteinerGreenButtonWithText.height / 2

    conteinerGreenButtonWithText.x = app.renderer.width / 10;
    conteinerGreenButtonWithText.y = app.renderer.height / 1.1;

    richText.x = 0 //conteinerGreenButtonWithText.x;
    richText.y = 0 //conteinerGreenButtonWithText.y;

    conteinerGreenButtonWithText.addChild(richText);

    app.stage.addChild(conteinerGreenButtonWithText);
}

function loadFinger(){
    let textureForFinger = PIXI.Texture.from('app/assets/raw/finger.png');
    finger = new PIXI.Sprite(textureForFinger);

    finger.anchor.set(0.5);

    app.stage.addChild(finger);
    finger.visible = false;
}

function loadEndWindow(){
    let textureForShapeBG = PIXI.Texture.from('app/assets/raw/shape288.png');
    let textureForSuccessBG = PIXI.Texture.from('app/assets/raw/success_background.png');

    ShapeBG = new PIXI.Sprite(textureForShapeBG);
    SuccessBG = new PIXI.Sprite(textureForSuccessBG);

    ShapeBG.anchor.set(0.5);
    SuccessBG.anchor.set(0.5);

    ShapeBG.x = app.renderer.width / 2;
    ShapeBG.y = app.renderer.height / 2;

    SuccessBG.x = app.renderer.width / 2;
    SuccessBG.y = app.renderer.height / 2;

    ShapeBG.width = app.renderer.width;
    ShapeBG.height = app.renderer.height * 3.5;

    app.stage.addChild(ShapeBG);
    app.stage.addChild(SuccessBG);

    SuccessBG.visible = false;
    ShapeBG.visible = false;
}

function disableShowsCanselAction() {
    containerForCanselAction.visible = false;
}

function workWithItemsForUse(item){
    if(functionState < itemActive.length){
    itemToUse = item;

    item
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
    }
}

var itemToUse, spawnX, spawnY, isReturnToSpawn, lastPosX, lastPosY;
var massOfActionSpace = [containerForGardenbed, containerForCow, conteinerForMilkman];

function logicOfMovementItems(state, item, spawnX1, spawnY1){
    workWithItemsForUse(item);
    item.interactive = true;
    item.buttonMode = true;
    itemActive[functionState].visible = true;
    spawnX = spawnX1;
    spawnY = spawnY1;
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

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
    let radiusOfAction = 150;

    console.log(massOfActionSpace[functionState].x);

    if(Math.sqrt(Math.pow((massOfActionSpace[functionState].x - lastPosX), 2) + Math.pow((massOfActionSpace[functionState].y - lastPosY), 2)) <= radiusOfAction){
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
            falseVerOfStateLogic(lastPosX, lastPosY);
        }
        this.x = spawnX;
        this.y = spawnY;
    }
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
        lastPosX = newPosition.x;
        lastPosY = newPosition.y;
    }
}

function trueVerOfStateLogic(){
    isReturnToSpawn = false;
    itemsForUse[functionState].visible = false;
    usedTool[functionState].visible = true;
    functionState++
    console.log('Enter');
}

function falseVerOfStateLogic(posX, posY){
    containerForCanselAction.x = posX;
    containerForCanselAction.y = posY;
    containerForCanselAction.visible = true;
    setTimeout(disableShowsCanselAction, 3000);
    console.log('false');
}

function startEnding(){
    console.log('END');

    ShapeBG.visible = true;
    SuccessBG.visible = true;
    resourcesFromItems[2].visible = true;

    conteinerGreenButtonWithText.x = app.renderer.width / 2;
    conteinerGreenButtonWithText.y = app.renderer.height / 1.4;

    console.log(SuccessBG, ' ', resourcesFromItems[2]);

    resourcesFromItems[2].x = app.renderer.width / 2;
    resourcesFromItems[2].y = app.renderer.height / 2;

    myLogo.x = app.renderer.width / 2;
    myLogo.y = app.renderer.height / 4.5;

    resourcesFromItems.parentGroup = blueGroup;

    app.state.addChild(blueGroup);

    //conteinerGreenButtonWithText.zIndex = 1;
}

var frame = 0;
var textureForCows = [];
var lastFunctionState = -1;

function createCanvas() {
    //renderer.resize(windowWight, windowHeight); // изменение размера экрана

    app.renderer.backgroundColor = 0x000000; // изменение цвета бг
}

function StartAnimation(){
    ticker.add(appResize);
    ticker.add(Animate);
    ticker.start();
}

function Animate(){
    if(functionState != itemActive.length){
        if(lastFunctionState != functionState){
            console.log(lastFunctionState);
            logicOfMovementItems(functionState, itemsForUse[functionState], itemsForUse[functionState].x, itemsForUse[functionState].y);
            lastFunctionState = functionState;
        }
    }else{
        if(lastFunctionState != functionState){
            startEnding();
            lastFunctionState = functionState;
        }
    }
}

var view = {
    loadGame: function() {
        createCanvas();
        LoadAllImages();
        StartAnimation();
    }
}

view.loadGame();
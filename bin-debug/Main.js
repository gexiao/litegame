var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.demonActionList = ["run", "skillAttack1", "normalAttack", "uniqueAttack", "hit", "dead", "stun", "freeze", "win", "steady"];
        _this.deerActionList = ["daiji", "feiwen", "gongji01", "gongji02", "paobu", "shengli", "shifa", "shouji", "siwang"];
        _this.nTap = 0;
        _this.speed = 0.05;
        _this.time = 0;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        // var bigText: egret.TextField = new egret.TextField();
        // bigText.text = "平移和滚动显示对象,平移和滚动显示对象";
        // bigText.scrollRect = new egret.Rectangle(0, 0, 200, 50);
        // bigText.cacheAsBitmap = true;
        // this.addChild(bigText);
        // //创建一个按钮,点击后控制文本内容向左移动
        // //创建一个按钮,点击后控制文本内容向右移动
        // var btnRight: egret.Shape = new egret.Shape();
        // btnRight.graphics.beginFill(0x01cccc);
        // btnRight.graphics.drawRect(0,0,50,50);
        // btnRight.graphics.endFill();
        // btnRight.x = 150;
        // btnRight.y = 100;
        // this.addChild(btnRight);
        // btnRight.touchEnabled = true;
        // btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, onScroll, this);
        // //点击按钮后,控制文本向左右移动的方法
        // function onScroll(e: egret.TouchEvent): void {
        // var rect: egret.Rectangle = bigText.scrollRect;
        // switch (e.currentTarget) {
        //     case btnLeft:
        //     rect.x += 20;
        //     break;
        //     case btnRight:
        //     rect.x -= 20;
        //     break;
        // }
        // bigText.scrollRect = rect;
        // }
        // var img:egret.Bitmap = new egret.Bitmap();
        // img.texture = RES.getRes("egret_icon_png");
        // this.addChild(img);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
        RES.loadGroup("preload");
        this.nTap = 0;
        this.nTimeScale = undefined;
        var self = this;
        // this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, function( evt:egret.TouchEvent ):void{
        //      self.nTap +=1;
        //      console.log( "nTap switch: ", self.nTap );
        //      if(self.nTap % 4 == 0){
        //          console.log( "animation: walk");
        //         this.dragonArmature.animation.gotoAndPlay("walk");
        //      }else if(self.nTap % 3 == 0){
        //          console.log( "animation: Standby");
        //         this.dragonArmature.animation.gotoAndPlay("stand");
        //     }else if(self.nTap % 2 == 0){
        //          console.log( "animation: fall");
        //         this.dragonArmature.animation.gotoAndPlay("fall",0);
        //     }else if(self.nTap % 1 == 0){
        //          console.log( "animation: jump");
        //         this.dragonArmature.animation.play("jump",0);
        //     }   
        // }, this );
    };
    Main.prototype.onLeftButtonClick = function () {
        this.nTap = (this.nTap + 1) % this.demonActionList.length;
        console.log("on Button click : " + this.nTap);
        var actionName = this.demonActionList[this.nTap];
        this.demonActor.play(actionName);
        // this.hitTest();
        this.time = egret.getTimer();
        egret.startTick(this.moveStar, this);
    };
    Main.prototype.onRightButtonClick = function () {
        this.nTap = (this.nTap + 1) % this.deerActionList.length;
        console.log("on Button click : " + this.nTap);
        var actionName = this.deerActionList[this.nTap];
        this.deerActor.playLoop(actionName, 1);
    };
    Main.prototype.hitTest = function () {
        var isHit = this.demonActor.hitTestPoint(this.deerActor.x, this.deerActor.y);
        if (isHit) {
            this.demonActor.x -= 50;
        }
        else {
            this.demonActor.x += 1;
        }
    };
    Main.prototype.moveStar = function (timeStamp) {
        var now = timeStamp;
        var time = this.time;
        var pass = now - time;
        console.log("moveStar: ", (1000 / pass).toFixed(5));
        this.demonActor.x += this.speed * pass;
        if (this.demonActor.hitTestPoint(600, 800)) {
            this.demonActor.x = 50;
        }
        this.time = now;
        return false;
    };
    Main.prototype.onGroupComplete = function () {
        console.log(dragonBones.DragonBones.VERSION);
        // this.addBackground();
        this.demonActor = new HeroActor("demon", "armatureName");
        this.addChild(this.demonActor);
        this.demonActor.setScale(.5);
        this.demonActor.setPosition(50, 800);
        this.demonActor.play("pao");
        this.deerActor = new HeroActor("deer", "armatureName");
        this.addChild(this.deerActor);
        this.deerActor.setScale(.5);
        this.deerActor.setPosition(360, 800);
        this.deerActor.playAnimation("daji");
        egret.startTick(this.onTicker, this);
        this.addButton();
    };
    Main.prototype.addBackground = function () {
        var img = new egret.Bitmap();
        img.texture = RES.getRes("bg_image");
        img.width = 640;
        img.height = 1136;
        this.addChild(img);
    };
    Main.prototype.addButton = function () {
        this.addLeftButton();
        this.addRightButton();
    };
    Main.prototype.addLeftButton = function () {
        var btnLeft = new egret.Shape();
        btnLeft.graphics.beginFill(0xcccc01);
        btnLeft.graphics.drawRect(0, 0, 100, 100);
        btnLeft.graphics.endFill();
        btnLeft.x = 50;
        btnLeft.y = 1000;
        this.addChild(btnLeft);
        btnLeft.touchEnabled = true;
        btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLeftButtonClick, this);
    };
    Main.prototype.addRightButton = function () {
        var btnLeft = new egret.Shape();
        btnLeft.graphics.beginFill(0xff0000);
        btnLeft.graphics.drawRect(0, 0, 100, 100);
        btnLeft.graphics.endFill();
        btnLeft.x = 250;
        btnLeft.y = 1000;
        this.addChild(btnLeft);
        btnLeft.touchEnabled = true;
        btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRightButtonClick, this);
    };
    Main.prototype.onTicker = function (timeStamp) {
        if (!this._time) {
            this._time = timeStamp;
        }
        var now = timeStamp;
        var pass = now - this._time;
        this._time = now;
        dragonBones.WorldClock.clock.advanceTime(pass / 1000);
        return false;
    };
    Main.prototype.addArmatureToFactory = function (factory, name, directory) {
        var skeletonData = RES.getRes(directory + "/skeleton.json");
        var textureData = RES.getRes(directory + "/texture.json");
        var texture = RES.getRes(directory + "/texture.png");
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map
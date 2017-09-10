var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Actor = (function (_super) {
    __extends(Actor, _super);
    function Actor(directory, armatureName) {
        var _this = _super.call(this) || this;
        _this.bloodNumber = 100;
        _this.armatureName = armatureName;
        _this.directory = directory;
        return _this;
    }
    Actor.prototype.addToStage = function (event) {
        this.initBloodBar();
        var factory = new dragonBones.EgretFactory();
        this.addArmatureToFactory(factory, this.directory);
        this.armature = factory.buildArmature(this.armatureName);
        this.displayObj = this.armature.getDisplay();
        this.addChild(this.displayObj);
        dragonBones.WorldClock.clock.add(this.armature);
    };
    Actor.prototype.initBloodBar = function () {
        this.bloodBar = new egret.Sprite();
        this.bloodBar.graphics.beginFill(0x00ff00);
        this.bloodBar.graphics.drawRect(0, 100, 200, 100);
        this.bloodBar.graphics.endFill();
        this.addChild(this.bloodBar);
    };
    Actor.prototype.playAnimation = function (animationName) {
        this.armature.animation.gotoAndPlay(animationName);
    };
    Actor.prototype.play = function (animationName) {
        this.armature.animation.play(animationName, 0);
    };
    Actor.prototype.playLoop = function (animationName, loopCount) {
        this.armature.animation.play(animationName, loopCount);
    };
    Actor.prototype.setPosition = function (x, y) {
        this.displayObj.x = x;
        this.displayObj.y = y;
    };
    Actor.prototype.setX = function (x) {
        this.displayObj.x = x;
    };
    Actor.prototype.setY = function (y) {
        this.displayObj.y = y;
    };
    Actor.prototype.setScale = function (scale) {
        this.displayObj.scaleX = this.displayObj.scaleY = scale;
    };
    Actor.prototype.setScaleX = function (scaleX) {
        this.displayObj.scaleX = scaleX;
    };
    Actor.prototype.setScaleY = function (scaleY) {
        this.displayObj.scaleY = scaleY;
    };
    Actor.prototype.addArmatureToFactory = function (factory, directory) {
        var skeletonData = RES.getRes(directory + "/skeleton.json");
        var textureData = RES.getRes(directory + "/texture.json");
        var texture = RES.getRes(directory + "/texture.png");
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
    };
    return Actor;
}(egret.DisplayObjectContainer));
__reflect(Actor.prototype, "Actor");
//# sourceMappingURL=Actor.js.map
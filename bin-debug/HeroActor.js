var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HeroActor = (function (_super) {
    __extends(HeroActor, _super);
    function HeroActor(directory, armatureName) {
        var _this = _super.call(this, directory, armatureName) || this;
        _this.blood = 1000;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    HeroActor.prototype.onAddToStage = function (event) {
        _super.prototype.addToStage.call(this, event);
    };
    HeroActor.prototype.beAttacked = function (blood) {
        this.blood = this.blood - blood;
    };
    return HeroActor;
}(Actor));
__reflect(HeroActor.prototype, "HeroActor");
//# sourceMappingURL=HeroActor.js.map
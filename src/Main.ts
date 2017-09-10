class Main extends egret.DisplayObjectContainer{
    
    private demonActionList:Array<string> = ["run","skillAttack1","normalAttack","uniqueAttack","hit","dead","stun","freeze","win","steady"];

    private deerActionList:Array<string> = ["daiji","feiwen","gongji01","gongji02","paobu","shengli","shifa","shouji","siwang"];

    public constructor(){
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private nTap:number = 0;
    private nTimeScale:number;
    private _time:number;

    private onAddToStage(event:egret.Event){
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
        var self:Main = this;
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
    }


    public demonActor:Actor;
    public deerActor:Actor;

    private onLeftButtonClick(){
        this.nTap = (this.nTap + 1) % this.demonActionList.length;
        console.log("on Button click : "+this.nTap);
        var actionName = this.demonActionList[this.nTap];
        this.demonActor.play(actionName);
        // this.hitTest();

        this.time = egret.getTimer();
        egret.startTick(this.hitCheck,this);
    }

    private onRightButtonClick(){
        this.nTap = (this.nTap + 1) % this.deerActionList.length;
        console.log("on Button click : "+this.nTap);
        var actionName = this.deerActionList[this.nTap];
        this.deerActor.playLoop(actionName,1);
    }

    private hitTest(){
        var isHit:boolean = this.demonActor.hitTestPoint(this.deerActor.x,this.deerActor.y);
        if(isHit){
            this.demonActor.x -= 50;
        } else {
            this.demonActor.x += 1;
        }
    }

    private speed:number = 0.05;
    private time:number = 0;

    private hitCheck(timeStamp:number):boolean {
        var now = timeStamp;
        var time = this.time;
        var pass = now - time;
        console.log("hitCheck: ",(1000 / pass).toFixed(5));
        this.demonActor.x += this.speed * pass;
        if(this.demonActor.hitTestPoint(400,800)){
            this.demonActor.x = 50;
        }
        this.time = now;
        return false;
    }

    private onGroupComplete()
    {
        console.log(dragonBones.DragonBones.VERSION);
        // this.addBackground();

        this.demonActor = new HeroActor("demon","armatureName");
        this.addChild(this.demonActor);
        this.demonActor.setScale(.5);
        this.demonActor.setPosition(50,800);
        this.demonActor.play("pao");

        this.deerActor = new HeroActor("deer","armatureName");
        this.addChild(this.deerActor);
        this.deerActor.setScale(.5);
        this.deerActor.setPosition(360,800);
        this.deerActor.playAnimation("daji");

        egret.startTick(this.onTicker, this);

        this.addButton();
    }

    private addBackground(){
        var img:egret.Bitmap = new egret.Bitmap();
        img.texture = RES.getRes("bg_image");
        img.width = 640;
        img.height = 1136;
        this.addChild(img);
    }

    private addButton(){
        this.addLeftButton();
        this.addRightButton();
    }

    private addLeftButton(){

        var btnLeft: egret.Shape = new egret.Shape();
        btnLeft.graphics.beginFill(0xcccc01);
        btnLeft.graphics.drawRect(0, 0, 100, 100);
        btnLeft.graphics.endFill();
        btnLeft.x = 50;
        btnLeft.y = 1000;
        this.addChild(btnLeft);
        btnLeft.touchEnabled = true;
        btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLeftButtonClick, this);
    }

    private addRightButton(){
        var btnLeft: egret.Shape = new egret.Shape();
        btnLeft.graphics.beginFill(0xff0000);
        btnLeft.graphics.drawRect(0, 0, 100, 100);
        btnLeft.graphics.endFill();
        btnLeft.x = 250;
        btnLeft.y = 1000;
        this.addChild(btnLeft);
        btnLeft.touchEnabled = true;
        btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRightButtonClick, this);
    }

    private onTicker(timeStamp:number) {

        if(!this._time) {
            this._time = timeStamp;
        }

        var now = timeStamp;
        var pass = now - this._time;
        this._time = now;

        dragonBones.WorldClock.clock.advanceTime(pass / 1000);

        return false;
    }

    private addArmatureToFactory( factory:dragonBones.EgretFactory, name:string, directory:string ){
        var skeletonData = RES.getRes( directory + "/skeleton.json" );
        var textureData = RES.getRes( directory + "/texture.json" );
        var texture = RES.getRes( directory + "/texture.png" );
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
    }
}
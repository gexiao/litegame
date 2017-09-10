class Actor extends egret.DisplayObjectContainer{
    private armature:dragonBones.Armature;
    private animationName:string;
    private directory:string;
    private armatureName:string;
    private displayObj:any;
    private bloodBar:egret.Sprite;
    private bloodNumber:number = 100;

    public constructor(directory:string, armatureName:string){
        super();
        this.armatureName = armatureName;
        this.directory = directory;
    }

    public addToStage(event:egret.Event){
        this.initBloodBar();
        var factory = new dragonBones.EgretFactory();
        this.addArmatureToFactory(factory,this.directory);
        this.armature = factory.buildArmature(this.armatureName);
        this.displayObj = this.armature.getDisplay();
        this.addChild(this.displayObj);
        dragonBones.WorldClock.clock.add(this.armature);
    }

    private initBloodBar(){
        this.bloodBar = new egret.Sprite();
        this.bloodBar.graphics.beginFill( 0x00ff00 );
        this.bloodBar.graphics.drawRect(0, 100, 200, 100);
        this.bloodBar.graphics.endFill();
        this.addChild(this.bloodBar);
    }

    public playAnimation(animationName: string){
        this.armature.animation.gotoAndPlay(animationName);
    }

    public play(animationName: string){
        this.armature.animation.play(animationName,0);
    }

    public playLoop(animationName: string,loopCount: number){
        this.armature.animation.play(animationName,loopCount);
    }

    public setPosition(x:number, y:number){
        this.displayObj.x = x;
        this.displayObj.y = y;
    }

    public setX(x:number){
        this.displayObj.x = x;
    }

    public setY(y:number){
        this.displayObj.y = y;
    }

    public setScale(scale:number){
        this.displayObj.scaleX = this.displayObj.scaleY = scale;
    }

    public setScaleX(scaleX:number){
        this.displayObj.scaleX = scaleX;
    }

    public setScaleY(scaleY:number){
        this.displayObj.scaleY = scaleY;
    }

    private addArmatureToFactory( factory:dragonBones.EgretFactory,directory:string ){
        var skeletonData = RES.getRes( directory + "/skeleton.json" );
        var textureData = RES.getRes( directory + "/texture.json" );
        var texture = RES.getRes( directory + "/texture.png" );
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
    }
}
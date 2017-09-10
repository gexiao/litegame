class HeroActor extends Actor {

    private blood:number = 1000;

    public constructor(directory:string, armatureName:string){
        super(directory,armatureName);
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
       super.addToStage(event);
    }
    
    public beAttacked(blood :number){
        this.blood = this.blood - blood;
    }

    
}
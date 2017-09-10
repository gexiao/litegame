//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Dragon extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
        // RES.loadGroup("preload");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("dragon");
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {

        this.initGame();
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result:Array<any>):void {
        var self:any = this;

        var parser:egret.HtmlTextParser = new egret.HtmlTextParser();
        var textflowArr:Array<Array<egret.ITextElement>> = [];
        for (var i:number = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }

        var textfield:egret.TextField = self.textfield;
        var count:number = -1;
        var change:Function = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];

            self.changeDescription(textfield, lineArr);

            var tw = egret.Tween.get(textfield);
            tw.to({"alpha": 1}, 200);
            tw.wait(2000);
            tw.to({"alpha": 0}, 200);
            tw.call(change, self);
        };

        change();
    }

    /**
     * 切换描述内容
     * Switch to described content
     */
    private changeDescription(textfield:egret.TextField, textFlow:Array<egret.ITextElement>):void {
        textfield.textFlow = textFlow;
    }
    
    private factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
    private armature: dragonBones.Armature;
    private aniIndex: number = 0;
    private textureIndex: number = 0;
    private textures:Array<string> = ["parts/clothes1", "parts/clothes2", "parts/clothes3", "parts/clothes4"];

    private initGame(): void 
    {
        var skeletonData = RES.getRes("dragon/skeleton.json");
        var textureData = RES.getRes("dragon/texture.json");
        var texture = RES.getRes("dragon/texture.png");
        
        this.factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        this.factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
        
        this.armature = this.factory.buildArmature("Dragon");
        var armatureDisplay = this.armature.getDisplay();
        dragonBones.WorldClock.clock.add(this.armature);
        this.addChild(armatureDisplay);
        armatureDisplay.x = 200;
        armatureDisplay.y = 450;
        this.armature.animation.gotoAndPlay("walk");
        /* Egret 旧版本使用如下代码。Egret 2.5 以上版本不推荐使用。
			egret.Ticker.getInstance().register(function (advancedTime) {
				dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
			}, this);
		*/
		/*
        *  Egret 2.5 以上版本使用如下代码：
        * */
		egret.startTick(this.onTicker, this);
        
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
    }
    
	private _time:number;

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
	
    private changeClothes():void {
        //循环更换贴图
        this.textureIndex++;
        if (this.textureIndex >= 4) {
            this.textureIndex = this.textureIndex % 4; 
        }
        //从骨骼面板导出的textureData中获取Image实例，也可以单独从其他图片文件中构造Image
        var textureName:string = this.textures[this.textureIndex];
        var image = this.factory.getTextureDisplay(textureName);
        var slot: dragonBones.Slot = this.armature.getSlot("clothes");
        slot.display = image;
		console.log(slot.display);
    }
    
    private onTouch(evt: egret.TouchEvent): void 
    {
        if(evt.type == egret.TouchEvent.TOUCH_BEGIN)
        {
            this.changeClothes();
        }
    }
}

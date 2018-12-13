// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        timeLable: cc.Label,
        timeOverbg: cc.Node,
        timeCount: 60,
        timeCountTemp: {
            default: 0,
            visible: false
        },
        timeOverbgWTemp: {
            default: 0,
            visible: false
        },
        timeIndex: {
            default: null,
            visible: false
        },
        timeCallBack: {
            default: null,
            visible: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.timeCountTemp = this.timeCount
        this.timeOverbgWTemp = this.timeOverbg.width
    },

    start () {
        // this.startTime()
    },

    initTime(time = 60) {
        this.timeCount = time
        this.timeCountTemp = time
    },

    startTime(callback) {
        clearInterval(this.timeIndex);
        this.timeCountTemp = this.timeCount
        this.timeLable.string = this.timeCountTemp
        this.timeOverbg.width = this.timeOverbgWTemp
        this.timeIndex = setInterval(() => {
            if(this.timeCountTemp > 0){
                this.timeCountTemp--
                this.timeLable.string = this.timeCountTemp
                this.timeOverbg.width = this.timeOverbg.width - this.timeOverbg.width / this.timeCountTemp
            }else{
                if(callback) callback()
                clearInterval(this.timeIndex);
                this.timeCountTemp = this.timeCount
            }
        }, 1000)
    },

    stopTime() {
        clearInterval(this.timeIndex);
    },
    
    onDestroy() {
        clearInterval(this.timeIndex);
    }
});

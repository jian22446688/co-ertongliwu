// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

const mainHouse = require('./questionList')
var singQues = require('./SingleQuestion')

cc.Class({
    extends: cc.Component,

    properties: {
        // 底部移动标识 
        tipImage: cc.Node,
        bottomPoint: cc.Node,
        bottomPoints: [cc.Sprite],
        bottomStatus: [cc.SpriteFrame],
        btnsPlane: cc.Node,
        mainAnimator: cc.Animation,
        current: 0,
        isClick: true
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 初始化 播放动画的循环
        this.mainAnimator.getAnimationState('m-z').wrapMode = cc.WrapMode.Loop
        this.mainAnimator.node.scaleX = -1
    },

    start () {
        this.node.x = 0;
        this.initHostClick(this.current)
    },

    onEnable() {
        cc.log('d =---- c' );
        this.mainAnimator.play()
        this.btnsPlane.stopAllActions()
        this.btnsPlane.x = mainHouse.mainHousePoint[this.current]
        let questList =  mainHouse.question[0]
        questList.map((q, i) => {
            this.bottomPoints[i].spriteFrame = this.bottomStatus[q.status]
        })
    },

    // 点击按钮 切换画面
    onBtnLeftClick() {
        if(this.current - 1 < 0 || !this.isClick) return
        this.current--
        this.getBtnsHoust(this.current, false)
        this.initHostClick(this.current)
    },
    
    // 点击又按钮
    onBtnRightClick() {
        if(this.current + 1 >= this.btnsPlane.children.length - 1 || !this.isClick) return
        this.current++
        this.initHostClick(this.current)
        this.getBtnsHoust(this.current, true)
    },

    // 打开当前可以点击的 房子
    initHostClick(openindex) {
        if(openindex + 1 >= this.btnsPlane.children.length || openindex < 0) return
        this.btnsPlane.children.map(node => {
            if(node.getComponent(cc.Button)) node.getComponent(cc.Button).enabled = false 
        })
        this.btnsPlane.children[openindex + 1].getComponent(cc.Button).enabled = true
    },

    getBtnsHoust(index, isleft) {
        this.isClick = false
        this.mainAnimator.play('m-move')
        this.tipImage.active = false
        this.mainAnimator.node.scaleX = isleft ? -1 : 1
        let _tV2 = cc.v2(mainHouse.mainHousePoint[index], this.btnsPlane.y)
        let _actionby = cc.moveTo(4.2, _tV2)
        this.btnsPlane.runAction(_actionby)
        this.bottomPoint.runAction(cc.moveBy(0.6, cc.v2(isleft ? 57: -57, 0)))
        setTimeout(() => { 
            this.isClick = true
            this.mainAnimator.play()
            this.tipImage.active = true
        }, 4200)
    },

    // 用户点击房子
    onBtnsClickHouseClick(event, index) {
        let btnsEvent =  new cc.Event.EventCustom('on-btns-house', true)
        btnsEvent.setUserData(index)
        this.node.dispatchEvent(btnsEvent);
    },

    // 用户点击关闭
    onBtnsColseClick(){
        let btnsEvent =  new cc.Event.EventCustom('on-btns-main-close', true)
        this.node.dispatchEvent(btnsEvent);
    }

    // update (dt) {},
});


let mainHouse = require('./questionList')
const singQues = require('./SingleQuestion')

let backList = [
    // {
    //     from: null,
    //     to: null
    // }
]
let isBack = true

cc.Class({
    extends: cc.Component,
    properties: { 
        gameHome: cc.Node,
        gameHelp: cc.Node,
        gameQuest: cc.Node,
        gameMain: cc.Node,
        gameEnd: cc.Node,
        gameVideo: cc.VideoPlayer,
        gameisBack: true,
    },

    onLoad () { 
        cc.game.addPersistRootNode(this.node);
        if(cc.sys.os == cc.sys.OS_ANDROID) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
                this.backListPush(event)
            }, this.node);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onHideWelcome", "()V");
        }
    },

    onDestroy () {
        // cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this);
    },

    backListPush(event) {
        if(!isBack) return
        isBack = false
        if(event.keyCode == 6) {
            if( backList.length - 1 != -1 ) {
                this.hideGame()
                backList[backList.length - 1].from.active = true
                backList.splice(backList.length - 1, 1)
                this.playbtns('on-audio-stop-help')
                this.playbtns('on-audio-btns')
            }else{
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onShowAlertDialog", "()V");
            }
        }
        setTimeout(() => {
            isBack = true
        }, 900)
    },

    start () {
        this.hideGame()
        this.gameHome.active = true
        // quest close
        // 一定是回答正确 也进入这里
        this.node.on('on-btns-quest-close', event => {
            this.hideGame()
            this.gameMain.active = true
            this.playbtns('on-audio-btns')
        })

        // main to quest
        this.node.on('on-btns-house', event => {
            this.hideGame()
            this.gameQuest.active = true
            let index = event.detail
            this.playbtns('on-audio-btns')
            cc.log('ccccccccccccc', singQues._instance)
            singQues._instance.startQuestion(index)
            backList.push({
                from: this.gameMain,
                to: this.gameQuest
            })
        })

        // main sceen close
        this.node.on('on-btns-main-close', event => {
            this.hideGame()
            this.playbtns('on-audio-btns')
            this.gameHome.active = true
        })

        this.node.on('on-btns-home-s', event => {
            singQues._instance.setIsTimeComponent(true)
            this.hideGame()
            this.gameMain.active = true
            this.playbtns('on-audio-btns')
            backList = []
            backList.push({
                from: this.gameHome,
                to: this.gameMain
            })
        })
        
        // 玩一玩
        this.node.on('on-btns-home-w', event => {
            singQues._instance.setIsTimeComponent(false)
            this.hideGame()
            this.gameMain.active = true
            this.playbtns('on-audio-btns')
            backList = []
            backList.push({
                from: this.gameHome,
                to: this.gameMain
            })
        })

        // 进入最后 结束页面
        this.node.on('on-end-enter', event => {
            this.hideGame()
            this.gameEnd.active = true 
            backList = []
            backList.push({
                from: this.gameHome,
                to: this.gameEnd
            })
        })
    },

    hideGame() {
        // 初始化列表
        this.gameHome.active = false
        this.gameHelp.active = false
        this.gameQuest.active = false
        this.gameMain.active = false
        this.gameEnd.active = false
        // this.gameVideo.node.active = false
    },

    // 关闭游戏
    onBtns_home_close() { 
        cc.game.end()
    },

    // 学一学
    onBtns_home_x() {
        this.playbtns('on-audio-btns')
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onOpenVideo", "()V");
        }
    },

    // 测一测
    onBtns_home_s() {
        singQues._instance.setIsTimeComponent(true)
        this.hideGame()
        this.gameQuest.active = true
        this.gameQuest.opacity  = 255
        mainHouse.question[0].map(item => {
            item.status = 0
        })
        singQues._instance.startQuestion(0)

        backList = []
        backList.push({
            from: this.gameHome,
            to: this.gameQuest
        })
    },

    // 玩一玩 
    onBtns_home_w() {
        this.hideGame()
        this.gameHelp.active = true
        this.playbtns('on-audio-help-bg')
        this.playbtns('on-audio-btns')
        backList = []
        backList.push({
            from: this.gameHome,
            to: this.gameHelp
        })
    },

    // end 页面 
    onBtns_end_reset() {
        mainHouse.question[0].map(item => {
            item.status = 0
        })
        this.hideGame()
        this.gameHome.active = true
    },

    // end 退出
    onBtns_end_exit() {
        cc.game.end();
    },

    // 帮助 
    onBtns_home_h() {

    },
    // 帮助的关闭按钮  
    onBtns_home_hc() {
        this.hideGame()
        this.gameHome.active = true
        this.playbtns('on-audio-stop-help')
        this.playbtns('on-audio-btns')
    },

    // 帮助确定按钮
    onBtns_home_hs() {
        this.hideGame()
        this.gameMain.active = true
        mainHouse.question[0].map(item => {
            item.status = 0
        })
        singQues._instance.setIsTimeComponent(false)
        this.playbtns('on-audio-stop-help')
        this.playbtns('on-audio-btns')
        backList.push({
            from: this.gameHelp,
            to: this.gameMain
        })
    }, 

    // 播放声音
    playbtns (ename) {
        let helpEvent =  new cc.Event.EventCustom(ename, true)
        this.node.dispatchEvent(helpEvent);
    }
    
    // update (dt) {},
});

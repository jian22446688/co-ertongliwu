const questionList = require('./questionList')

var SingleQuestion = cc.Class({
    extends: cc.Component,
    statics : {
        _instance: null
    },
    properties: {
        question: [],
        imgType: [cc.SpriteFrame],
        // 提示设置
        tip_t1: cc.Node,
        tip_t2: cc.Node,

        // 时间组件
        timeComponent: cc.Node,

        // 错误提示
        tipErrorImage: cc.Node,

        // 存放答案
        qs: cc.Node,
        // 需要拖放的区域
        ansBox1 : { type: cc.Node, default: null },
        ansBox2 : { type: cc.Node, default: null }, 
        
        // 选择的答案
        answerListA: [],
        answerListB: [],
        selectObj: cc.Prefab,
        aCol: 0,
        aRow: 3,
        isTime: false,
        
        currentLave: 0,
        currentQuest: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        SingleQuestion._instance = this;
        this.question = questionList.question;

         //设置帧率
        cc.game.setFrameRate(60);
         //设置该对象为不销毁
        // cc.game.addPersistRootNode(this.node);
        this.ansBox1.children.forEach(node => { node.c_data = 0 });
        this.ansBox2.children.forEach(node => { node.c_data = 0 });

        // 错误提示
        this.tipErrorImage.active = false
    },
    start () { 
        // this.initQuestion()
    },

    // 关闭问题页面
    onBtnClose() {
        if(this.isTime){
            let btnsEventa =  new cc.Event.EventCustom('on-btns-main-close', true)
            this.node.dispatchEvent(btnsEventa);
        } else {
            let btnsEvent =  new cc.Event.EventCustom('on-btns-quest-close', true)
            this.node.dispatchEvent(btnsEvent);
        }
    },

    initQuestion() {
        this.answerListA = []
        this.answerListB = []
        this.ansBox1.children.map(node => node.removeAllChildren())
        this.ansBox2.children.map(node => node.removeAllChildren())
        this.qs.removeAllChildren()
        let ax = 155, xy = 500;
        let ans = this.question[this.currentLave][this.currentQuest]
        this.ansBox1.c_quesType = ans.atype
        this.ansBox2.c_quesType = ans.btype
        this.tip_t1.getChildByName('q-1').getComponent(cc.Sprite).spriteFrame = this.imgType[ans.atype]
        this.tip_t1.getChildByName('label').getComponent(cc.Label).string = ans.acount + ' 个'
        this.tip_t2.getChildByName('q-1').getComponent(cc.Sprite).spriteFrame = this.imgType[ans.btype]
        this.tip_t2.getChildByName('label').getComponent(cc.Label).string = ans.bcount + ' 个'
        let spriteArr = getImageArr.call(this)
        let _t = 0
        for(var i = 0; i < this.aRow; i++) {
            for(var j = 0; j < this.aCol; j++) {
                var item = cc.instantiate(this.selectObj)
                item.getComponent(cc.Sprite).spriteFrame = spriteArr[_t].sprite
                item.name = 'q_' + _t
                item.x = ax + ((64 + 60) * j) 
                item.y = xy - ((64 + 40) * i)
                item.c_data = spriteArr[_t].type
                this.qs.addChild(item);
                _t++
            }
        }
        function getImageArr() {
            let arr = []
            for(let i=0; i<ans.acount; i++){
                arr.push({ type: ans.atype, sprite: this.imgType[ans.atype]})
            }
            for(let t=0; t < ans.bcount; t++){
                arr.push({ type: ans.btype, sprite :this.imgType[ans.btype]})
            }
            let tharr = this.aRow * this.aCol - arr.length
            for(let j=0; j < tharr; j++){
                let n = Math.floor(Math.random() * ans.typearr.length); 
                let _t = ans.typearr[n]
                arr.push({ type: _t, sprite: this.imgType[_t]})
            }
            arr.sort(function(){ return Math.random()>0.5?-1:1; });  
            return arr
        }
    },

    // 设置选择的答案
    setSelectAnser(_olist, obj) {
        _olist.push(obj.node.c_data)
    },

    chickAnswer() {
        let ans = this.question[this.currentLave][this.currentQuest]
        if(ans.acount != this.answerListA.length || ans.bcount != this.answerListB.length){
            return false
        }
        for(var i=0; i<this.answerListA.length; i++){
            if(ans.atype != this.answerListA[i]){
                return false
            }
        }
        for(var i=0; i < this.answerListB.length; i++){
            if(ans.btype != this.answerListB[i]){
                return false
            }
        }
        return true
    },

    // 直接下一题
    nextQuestion() {
        this.currentQuest++
        this.initQuestion()
    },
    
    // 根据 index 进入选择的题目
    startQuestion(index) {
        this.timeComponent.active = false
        this.currentQuest = index
        if(this.currentQuest >= this.question[this.currentLave].length) {
            let btnsEvent = null
            if(this.isTime){
                btnsEvent = new cc.Event.EventCustom('on-btns-main-close', true)
            } else {
                btnsEvent = new cc.Event.EventCustom('on-btns-quest-close', true)
            }
            this.node.dispatchEvent(btnsEvent);
            return 
        }
        this.initQuestion()
        if(this.isTime) {
            this.timeComponent.active = true
            this.timeComponent.getComponent('TimeOver').startTime(() => {
                let btnsEvents = null
                if(this.isTime){
                    btnsEvents = new cc.Event.EventCustom('on-btns-main-close', true)
                } else {
                    btnsEvents = new cc.Event.EventCustom('on-btns-quest-close', true)
                }
                this.node.dispatchEvent(btnsEvents);
            })
        }
    },

    // 设置时间组件
    setIsTimeComponent(istime) {
        this.isTime = istime
    },

    // 获取问题数据
    getQuestion() {
        return this.question[this.currentLave][this.currentQuest]
    },

    // 确定按钮点击 判断是否正确
    onConfirmAnswer() {
        let btnsaudio =  new cc.Event.EventCustom('on-audio-btns', true)
        this.node.dispatchEvent(btnsaudio);
        let ans = this.question[this.currentLave][this.currentQuest]
        if(this.answerListA.length == 0 && this.answerListB.length == 0) {
            return
        }
        if(!this.chickAnswer()){
            ans.status = 0
            this.tipErrorImage.active = true
            this.tipErrorImage.y = this.tipErrorImage.height + cc.winSize.height
            let action = cc.moveTo(0.6, cc.v2(this.tipErrorImage.x, cc.winSize.height / 2))
            this.tipErrorImage.runAction(action)
            setTimeout(() => {
                this.startQuestion(this.currentQuest)
                this.tipErrorImage.active = false
            }, 1800)
        }else{
            // TODO 选择正确
            ans.status = 1
            let isend = this.question[this.currentLave].every(item => item.status == 1)
            if(this.isTime){
                if(!isend) {
                    let btnsEventa =  new cc.Event.EventCustom('on-audio-quest-guoguan', true)
                    this.node.dispatchEvent(btnsEventa);
                    setTimeout(()=> {
                        this.startQuestion(this.currentQuest + 1)
                    }, 2300 )
                    return 
                }
            }
            if(!isend){
                let btnsEventa =  new cc.Event.EventCustom('on-audio-quest-guoguan', true)
                this.node.dispatchEvent(btnsEventa);
                setTimeout(()=> {
                    let btnsEvent =  new cc.Event.EventCustom('on-btns-quest-close', true)
                    this.node.dispatchEvent(btnsEvent);
                }, 2300 )
                return 
            }
            let endEvent =  new cc.Event.EventCustom('on-audio-quest-gongxi', true)
            this.node.dispatchEvent(endEvent);
            setTimeout(()=> {
                let endEventa =  new cc.Event.EventCustom('on-end-enter', true)
                this.node.dispatchEvent(endEventa);
            }, 2300 )
        }
    }
    // update (dt) {},
});

// SingleQuestion._instance = null
// SingleQuestion.getInstance = () => {
//     if(!SingleQuestion._instance){
//         SingleQuestion._instance = new SingleQuestion()
//     }
//     return SingleQuestion._instance
// }
// export default SingleQuestion

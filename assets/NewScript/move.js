// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var singQues = require('./SingleQuestion')

cc.Class({
    extends: cc.Component,
    properties: {
        ansType: 'a'
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        var self = this;
        var isMove = false;
        let ansBox1 = singQues._instance.ansBox1
        let ansBox2 = singQues._instance.ansBox2
        var rect_a = new cc.Rect(ansBox1.x - ansBox1.width / 2, ansBox1.y - ansBox1.height / 2, ansBox1.width, ansBox1.height)
        var rect_b = new cc.Rect(ansBox2.x - ansBox2.width / 2, ansBox2.y - ansBox2.height / 2, ansBox2.width, ansBox1.height)
        let originalVec2 = null
        let zindex = null
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
            isMove = true;
            originalVec2 = self.node.position
            zindex = self.node.zindex
            self.node.zIndex = 999;
            self.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
                if(isMove){
                    self.node.x += event.getDelta().x
                    self.node.y += event.getDelta().y
                    let _selfRect = new cc.Rect(self.node.x, self.node.y, self.node.width, self.node.height)
                    let question = singQues._instance.getQuestion()
                    if(rect_a.containsRect(_selfRect)) {
                        if(singQues._instance.answerListA.length >= 5) return
                        let isqutiona = singQues._instance.answerListA.length >= question.acount
                        if(isqutiona) {
                            let btnsEvent =  new cc.Event.EventCustom('on-audio-quest-erroe', true)
                            self.node.dispatchEvent(btnsEvent);
                            self.node.runAction(cc.moveTo(0.6, originalVec2))
                        }else{
                            let iseq = self.moveToAnswerBox(ansBox1, singQues._instance.answerListA)
                            if(!iseq) {
                                self.node.runAction(cc.moveTo(0.6, originalVec2))
                            }
                        }
                        isMove = false;
                    }
                    if(rect_b.containsRect(_selfRect)){
                        if(singQues._instance.answerListB.length >= 5) return
                        let isqutionb = singQues._instance.answerListB.length >= question.bcount
                        if(isqutionb) {
                            let btnsEvent =  new cc.Event.EventCustom('on-audio-quest-erroe', true)
                            self.node.dispatchEvent(btnsEvent);
                            self.node.runAction(cc.moveTo(0.6, originalVec2))
                        } else {
                            let iseq = self.moveToAnswerBox(ansBox2, singQues._instance.answerListB)
                            if(!iseq) {
                                self.node.runAction(cc.moveTo(0.6, originalVec2))
                            }
                        }
                        isMove = false;
                    }
                }
                event.stopPropagation();
            }, self.node)
        }, this.node)
        this.node.on(cc.Node.EventType.TOUCH_END, ()=> {
            if(isMove) {
                self.node.setPosition(originalVec2)
                self.node.zIndex = zindex;
            }
            isMove = false;
            self.node.off(cc.Node.EventType.TOUCH_MOVE);
        }, this.node)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, ()=> {
            if(isMove){
                self.node.setPosition(originalVec2)
                self.node.zIndex = zindex;
            }
            isMove = false;
            self.node.off(cc.Node.EventType.TOUCH_MOVE);
        }, this.node)
    },

    start () { },
    
    // 拖动移动物体
    moveToAnswerBox(ansbox, anslist) {
        if(this.node.c_data == ansbox.c_quesType){
            // todo 拖动选择正确
            this.node.setParent(ansbox.children[anslist.length])
            this.node.setPosition(new cc.Vec2(0, 0))
            singQues._instance.setSelectAnser(anslist, this)
            this.node.off(cc.Node.EventType.TOUCH_START);
            this.node.off(cc.Node.EventType.TOUCH_END);
            this.node.off(cc.Node.EventType.TOUCH_MOVE);
            return true
        } else {
            // todo 拖动选择错误 提示音响
            let btnsEvent =  new cc.Event.EventCustom('on-audio-quest-erroe', true)
            this.node.dispatchEvent(btnsEvent);
            return false
        }
    },
});

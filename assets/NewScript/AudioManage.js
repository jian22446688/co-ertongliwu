
cc.Class({
    extends: cc.Component,

    properties: {
        auBtns: {
            default: null,
            type: cc.AudioClip
        },
        ques_help: {
            default: null,
            type: cc.AudioClip
        },

        ques_error: {
            default: null,
            type: cc.AudioClip
        },

        ques_guoguan: {
            default: null,
            type: cc.AudioClip
        },

        ques_gongxi: {
            default: null,
            type: cc.AudioClip
        },

        audioSource: {
            default: null,
            type: cc.AudioSource,
            visible: false
        },

        help_audo_bg: {
            default: null,
            visible: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.audioSource = this.getComponent(cc.AudioSource)
        // 停止播放音频
        this.node.on('on-audio-stop', event => {
            cc.audioEngine.stopAll()
        })

        // 暂停播放帮助页面的音频
        this.node.on('on-audio-stop-help', ()=> {
            cc.audioEngine.stop(this.help_audo_bg)
        })

        // 播放按钮音响
        this.node.on('on-audio-btns', () => {
            cc.audioEngine.play(this.auBtns)
        }) 

        // 选择错误
        this.node.on('on-audio-quest-erroe', event => {
            cc.audioEngine.play(this.ques_error);
        })

        // 下一关
        this.node.on('on-audio-quest-guoguan', event => {
            cc.audioEngine.play(this.ques_guoguan);
        })

        // 过关
        this.node.on('on-audio-quest-gongxi', event => {
            cc.audioEngine.play(this.ques_gongxi);
        })

        //播放帮助音频
        this.node.on('on-audio-help-bg', event => {
           this.help_audo_bg = cc.audioEngine.play(this.ques_help);
        })

    },

    start () {

    },

    // update (dt) {},
});

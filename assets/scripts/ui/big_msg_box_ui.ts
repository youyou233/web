//import CostItem from "../controller/ui/cost_items"

import AudioManager from "../manager/audio_manager"

// import UIAnimaManager from "../manager/action_manager"

const { ccclass, property } = cc._decorator

interface OkCalBack {
    (isOK: boolean, param?: {}): void
}

@ccclass
export default class BigMsgBoxUI extends cc.Component {
    static instance: BigMsgBoxUI = null

    @property(cc.Node)
    uiNode: cc.Node = null

    @property(cc.Node)
    maskNode: cc.Node = null

    @property(cc.Label)
    labelTitle: cc.Label = null


    @property(cc.Button)
    buttonCancel: cc.Button = null
    @property(cc.Button)
    buttonConfirm: cc.Button = null

    @property(cc.Label)
    labelCancel: cc.Label = null
    @property(cc.Label)
    labelConfirm: cc.Label = null
    // @property(CostItem)
    // costItems: CostItem = null
    @property(cc.ScrollView)
    sv: cc.ScrollView = null

    curCallBack: OkCalBack = null
    curParam: any = null

    @property(cc.Node)
    decContainer: cc.Node = null;

    _isClick: boolean = false

    onLoad() {
        // console.log("PoolManager Onload");
        BigMsgBoxUI.instance = this

        //this.maskNode.on('click', this.hideUI, this);

        this.buttonCancel.node.on("click", this.cancel, this)
        this.buttonConfirm.node.on("click", this.confirm, this)

        if (this.uiNode.active) {
            this.uiNode.active = false
        }
    }

    showUI(title: string, type: number, callback: OkCalBack = null) {
        if (!this.uiNode.active) {
            this.uiNode.active = true
            //  UIAnimaManager.instance.showDialog(this.uiNode, this.maskNode)
        }
        AudioManager.instance.playAudio('card_up')
        this.decContainer.children.forEach((n) => { n.active = false })
        this.decContainer.children[type].active = true
        this.labelTitle.string = title
        if (callback != null) {
            //console.log("需要回调函数")
            this.curCallBack = callback
        } else {
            this.curCallBack = null
        }
      
        this.sv.scrollToTop(0.1)
        //   console.log('打开', this.node.parent.name)
    }

    cancel() {
        //console.log("取消")
        if (this.curCallBack != null) {
            this.curCallBack(false, this.curParam)
        }
        this.hideUI()
    }

    confirm() {
        //console.log("确定")
        if (this._isClick) {
            return
        }
        this._isClick = true
        this.scheduleOnce(function () {
            this._isClick = false
        }, 0.2)

        if (this.curCallBack != null) {
            this.curCallBack(true, this.curParam)
        }
        this.hideUI()
    }
    hideUI() {
        AudioManager.instance.playAudio('card_down')
        this.uiNode.active = false
        //  AudioManager.instance.playAudio('ui_close')

    }
}

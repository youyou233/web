import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"

const { ccclass, property } = cc._decorator

interface PopTextParam {
    spr: string,
    name: string,
    dec: string
}
declare global {
    interface Window {
        winSize: any
    }
}
//气泡弹框
@ccclass
export default class PopTextUI extends cc.Component {
    static instance: PopTextUI = null
    private _view:any// PopTextUIView = new PopTextUIView()
    onLoad() {
        this._view.initView(this.node)
        PopTextUI.instance = this
        this._view.content.active = false
        this._bindEvent()
    }
    private _bindEvent() {
        this._view.nodeMask.on("click", this.hideUI, this)
    }
    showUI(pos: cc.Vec2, param: PopTextParam) {
       AudioManager.instance.playAudio('card_up')

        // AudioManager.instance.playAudio("sclick_4")
        this.node.zIndex = 999
        if (pos.y < -(window.winSize.height / 2 - 100)) {
            pos.y = -(window.winSize.height / 2 - 100)
        }
        this.node.setPosition(pos)
        this._view.nodeLeft.active = false
        this._view.nodeRight.active = false
        if (pos.x < 0) {
            this._view.nodeLeft.active = true
           // this._view.sprMainL.spriteFrame = ResourceManager.instance.getSprite(ResType.main, param.spr)
            Utils.setSpScale(this._view.sprMainL.node, 50)
            this._view.labDecL.string = param.dec
            this._view.labNameL.string = param.name
        } else {
            this._view.nodeRight.active = true
           // this._view.sprMainR.spriteFrame = ResourceManager.instance.getSprite(ResType.main, param.spr)
            Utils.setSpScale(this._view.sprMainR.node, 50)
            this._view.labDecR.string = param.dec
            this._view.labNameR.string = param.name
        }
        ActionManager.instance.popOut(this._view.content)

    }

    hideUI() {
        
       AudioManager.instance.playAudio('card_down')
        //  AudioManager.instance.playAudio("sclick_2")
        this._view.content.active = false
    }

}
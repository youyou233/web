import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class DemoUI extends cc.Component {
    static instance: DemoUI = null
    private _view: any// = new DemoUIView()
    onLoad() {
        this._view.initView(this.node)
        DemoUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
        //this._view.btnBack.node.on("click", this.hideUI, this)
    }
    showUI() {
        ActionManager.instance.fadeShowDialog(this._view.content)
    }
    refreshUI() {

    }
    hideUI() {
        this._view.content.active = false
    }
}
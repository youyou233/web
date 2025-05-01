import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import DaliyUIView from "../ui_view/panel/daliy_ui_view"
import DD from "../manager/dynamic_data_manager"
import UIManager from "../manager/ui_manager"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class DailyUI extends cc.Component {
    static instance: DailyUI = null
    private _view: DaliyUIView = new DaliyUIView()
    onLoad() {
        this._view.initView(this.node)
        DailyUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {

        this._view.nodeMask.on("click", this.hideUI, this)
        this._view.btnCertain.node.on("click", this.onReward, this)
    }
    showUI() {
        AudioManager.instance.playAudio("click")
        ActionManager.instance.popOut(this._view.content, this._view.nodeMask)
    }
    refreshUI() {

    }
    hideUI() {
        this._view.content.active = false
    }
    onReward() {
        AudioManager.instance.playAudio("click")
        let data = new Date().getTime()
        DD.instance.playerData.lastDaliy = data
        UIManager.instance.LoadTipsByStr("领取成功，获得：" + 20 + "种子。")
        this.hideUI()
    }
}
import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import OfflineUIView from "../ui_view/panel/offline_ui_view"
import DD from "../manager/dynamic_data_manager"
import UIManager from "../manager/ui_manager"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class OfflineUI extends cc.Component {
    static instance: OfflineUI = null
    private _view: OfflineUIView = new OfflineUIView()
    onLoad() {
        this._view.initView(this.node)
        OfflineUI.instance = this
        this._bindEvent()
        setInterval(() => {
            if (this._view.content.active) {
                this.refreshUI()
            }
        }, 1000);
    }
    private _bindEvent() {
        this._view.nodeMask.on("click", this.hideUI, this)
        this._view.btnCertain.node.on("click", this.onClickCertain, this)
    }
    showUI() {
        AudioManager.instance.playAudio("card_up")
        ActionManager.instance.fadeShowDialog(this._view.content)
        this.refreshUI()

    }
    refreshUI() {
        let nowDate = new Date().getTime()
        let minReward = 0//DD.instance.playerData.buildMap[BuildType.加工坊]
        this._view.labCur.string = "+" + minReward + "/分钟"
        this._view.labTime.string = `当前累计时间：${Utils.getTimeFormat((nowDate - DD.instance.playerData.lastReward) / 1000)}
当前累计可获得`
        let min = Math.floor((nowDate - DD.instance.playerData.lastReward) / 1000 / 60 * minReward)
        this._view.labMoney.string = min + ""
    }
    hideUI() {
        AudioManager.instance.playAudio("card_down")
        this._view.content.active = false
    }
    onClickCertain() {
        let nowDate = new Date().getTime()
        let minReward = 0//DD.instance.playerData.buildMap[BuildType.加工坊]
        let min = Math.floor((nowDate - DD.instance.playerData.lastReward) / 1000 / 60 * minReward)
        if (min < 0) {
            UIManager.instance.LoadTipsByStr("暂无奖励可领取。")
            return
        }
        UIManager.instance.LoadTipsByStr("领取成功，获得金币" + min + "。")
        DD.instance.playerData.lastReward = nowDate
        DD.instance.addMoney(min)
        this.refreshUI()
    }
}
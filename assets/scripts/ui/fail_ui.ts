import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import FailUIView from "../ui_view/panel/fail_ui_view"
import GameManager from "../manager/game_manager"
import HomeUI from "./home_ui"
import DD from "../manager/dynamic_data_manager"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class FailUI extends cc.Component {
    static instance: FailUI = null
    _view: FailUIView = new FailUIView()
    onLoad() {
        this._view.initView(this.node)
        FailUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
        this._view.btnCertain.node.on("click", this.hideUI, this)
        //this._view.btnCertain.
    }
    showUI() {
        ActionManager.instance.fadeShowDialog(this._view.content)
        // if (GameManager.instance.unlimite) {
        //     this._view.labTitle.string="得分"
        //     this._view.labLevel.string = GameManager.instance.score + ""
        // } else {
        //     this._view.labTitle.string="关卡"

        //     this._view.labLevel.string = GameManager.instance.level + ""
        // }
       // AudioManager.instance.playAudio("fail")
    }
    refreshUI() {

    }
    hideUI() {
     
        AudioManager.instance.playAudio("click")
        this._view.content.active = false
        HomeUI.instance.showUI()
    }
}
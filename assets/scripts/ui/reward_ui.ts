import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import RewardUIView from "../ui_view/panel/reward_ui_view"
import GameManager from "../manager/game_manager"
import DD from "../manager/dynamic_data_manager"
import HomeUI from "./home_ui"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class RewardUI extends cc.Component {
    static instance: RewardUI = null
    _view: RewardUIView = new RewardUIView()
    lv: number = 0
    onLoad() {
        this._view.initView(this.node)
        RewardUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {

        this._view.btnCertain.node.on("click", this.hideUI, this)
    }
    //通过关卡
    showUI(lv) {
        ActionManager.instance.fadeShowDialog(this._view.content)
        this.lv = lv
        this.refreshUI()
        AudioManager.instance.playAudio("Win")

    }
    protected update(dt: number): void {
        this._view.nodeBg.angle += dt * 20
    }
    refreshUI() {
        let lv = this.lv
        this._view.labReward.string = "获得奖励"
        this._view.labLevel.string = this.lv + ""
        this._view.labMoney.string = 100 * Math.pow(2, this.lv) + ""
        // if (GameManager.instance.unlimite) {
        //     this._view.labTitle.string = "得分"
        //     this._view.labLevel.string = GameManager.instance.score.toFixed(0)


        //     this._view.nodeMoney.active = true
        //     this._view.nodeDiamond.active = false
        //     this._view.labMoney.string = Math.floor(GameManager.instance.score / 10) + ""

        // } else {
        //     this._view.labTitle.string = "关卡"
        //     this._view.labLevel.string = lv + ""

        //     if (DD.instance.playerData.maxLevel >= lv) {
        //         this._view.nodeDiamond.active = false
        //         this._view.nodeMoney.active = false
        //         this._view.labReward.string = "挑战成功"
        //     } else {
        //         this._view.nodeMoney.active = true
        //         this._view.nodeDiamond.active = true
        //         this._view.labMoney.string = 100 + ""
        //     }
        // }



    }
    hideUI() {
        //DD.instance.playerData.farmMap = GameManager.instance.aheadPanel
        AudioManager.instance.playAudio('card_down')
        DD.instance.addMoney(100 * Math.pow(2, this.lv))
        this._view.content.active = false
        HomeUI.instance.showUI()
    }
}
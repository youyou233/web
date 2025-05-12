import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import SignUIView from "../ui_view/panel/sign_ui_view"
import DD from "../manager/dynamic_data_manager"
import { MessageType } from "../utils/message"
import UIManager from "../manager/ui_manager"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class SignUI extends cc.Component {
    static instance: SignUI = null
    private _view: SignUIView = new SignUIView()
    onLoad() {
        this._view.initView(this.node)
        SignUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
        this._view.nodeMask.on("click", this.hideUI, this)
        this._view.nodeContainer.children.forEach((node, index) => {
            node.on("click", () => {
                this.onClickReward(index)
            }, this)
        })
        this._view.btnSign7.node.on("click", () => {
            this.onClickReward(6)
        }, this)
       // Emitter.register(MessageType.onDayBy, this.refreshUI, this)
    }
    showUI() {
        AudioManager.instance.playAudio('card_up')
        ActionManager.instance.popOut(this._view.content, this._view.nodeMask)
        this.refreshUI()
    }
    refreshUI() {
        let signDay = DD.instance.playerData.signDay
        let haveSign = Utils.isSameDay(new Date().getTime(), DD.instance.playerData.lastSign)
        this._view.nodeContainer.children.forEach((node) => {
            node.getChildByName("mask").active = false
            node.getChildByName("nodeLock").active = false
        })
        let btnList = this._view.nodeContainer.children.concat([this._view.btnSign7.node])
        btnList.forEach((node, index) => {
            if (index <= signDay - 1) {
                node.getChildByName("mask").active = true
                node.getChildByName("nodeLock").active = false
            } else if (index == signDay) {
                node.getChildByName("mask").active = false
                node.getChildByName("nodeLock").active = false
            } else {
                node.getChildByName("mask").active = false
                node.getChildByName("nodeLock").active = true
            }
        })

    }
    hideUI() {
        AudioManager.instance.playAudio('card_down')
        this._view.content.active = false
    }
    onClickReward(index) {
        AudioManager.instance.playAudio('click')
        let haveSign = Utils.isSameDay(new Date().getTime(), DD.instance.playerData.lastSign)
        if (haveSign) {
            UIManager.instance.LoadTipsByStr("今日已签到。")
            return
        }
        if (DD.instance.playerData.signDay == index) {
            DD.instance.playerData.lastSign = new Date().getTime()
            DD.instance.playerData.signDay++
            if (DD.instance.playerData.signDay == 7) {
                DD.instance.playerData.signDay = 0
            }
        } else {
            return
        }
        let num = [10, 20, 30, 40, 50, 60, 100]
        UIManager.instance.LoadTipsByStr("领取成功，获得会员卡" + num[index] + "。")
        DD.instance.addDiamond(num[index])
        this.refreshUI()
    }
}
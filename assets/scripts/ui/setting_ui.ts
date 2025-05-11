import ActionManager from "../manager/action_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import SettingUIView from "../ui_view/panel/setting_ui_view"
import DD from "../manager/dynamic_data_manager"
import AudioManager from "../manager/audio_manager"
import UIManager from "../manager/ui_manager"
import HttpManager from "../manager/http_manager"
import { Config } from "../utils/config"
import { MessageType } from "../utils/message"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class SettingUI extends cc.Component {
    static instance: SettingUI = null
    private _view: SettingUIView = new SettingUIView()
    onLoad() {
        this._view.initView(this.node)
        SettingUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
        this._view.nodeMask.on("click", this.hideUI, this)
        this._view.btnBack.node.on("click", this.hideUI, this)
        this._view.btnNewName.node.on("click", this.onClickNewName, this)
    }
    showUI() {
        AudioManager.instance.playAudio('card_up')
        ActionManager.instance.popOut(this._view.content, this._view.nodeMask)
        this.refreshUI()
    }
    refreshUI() {
        this._view.labName.string = DD.instance.playerData.nickName
        this._view.labUserId.string = DD.instance.playerData.id
        this._view.nodeMusic.getComponent(cc.Slider).progress = DD.instance.config.music
        this._view.nodeAudio.getComponent(cc.Slider).progress = DD.instance.config.audio
        this._view.btnNewName.node.active = true
        this._view.nodeNewName.active = false
    }
    hideUI() {
        DD.instance.saveConfig()
        AudioManager.instance.playAudio('card_down')
        this._view.content.active = false
    }
    onClickNewName() {
        AudioManager.instance.playAudio("chooseOp")
        this._view.labName.string = ""
        this._view.nodeNewName.active = true
        this._view.nodeNewName.getComponent(cc.EditBox).string = ""
        this._view.btnNewName.node.active = false
    }
    onEditEnd() {
        let string = this._view.nodeNewName.getComponent(cc.EditBox).string
        if (!string) {
            UIManager.instance.LoadTipsByStr("名称不能为空。")
        }
        HttpManager.instance.newRequest(`${Config.serverIP}`, {
            requestCode: "updateNickName",
            nickName: string,
        }).then((res: any) => {
            cc.log(res)
            if (res.code == -1) {
                UIManager.instance.LoadTipsByStr(res.msg)
                return
            }
            DD.instance.playerData.nickName = string
            this.refreshUI()
            DD.instance.saveData()
            Emitter.fire(MessageType.changeName)
        })
    }
    onChangeMusic() {
        DD.instance.config.music = this._view.nodeMusic.getComponent(cc.Slider).progress
        AudioManager.instance.changeBgmVolume(DD.instance.config.music)
    }
    onChangeAudio() {
        DD.instance.config.audio = this._view.nodeAudio.getComponent(cc.Slider).progress

    }
}
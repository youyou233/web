import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import RegisterUIView from "../ui_view/panel/register_ui_view"
import UIManager from "../manager/ui_manager"
import HttpManager from "../manager/http_manager"
import { Config } from "../utils/config"
import HomeUI from "./home_ui"
import DD from "../manager/dynamic_data_manager"
import MainManager from "../manager/main_manager"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class RegisterUI extends cc.Component {
    static instance: RegisterUI = null
    private _view: RegisterUIView = new RegisterUIView()
    onLoad() {
        this._view.initView(this.node)
        RegisterUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
        this._view.btnCancel.node.on("click", this.hideUI, this)
        this._view.btnCertain.node.on("click", this.onClickCertain, this)
    }
    showUI() {
        AudioManager.instance.playAudio('card_up')
        ActionManager.instance.fadeShowDialog(this._view.content)
        this.refreshUI()
    }
    onClickCertain() {
        AudioManager.instance.playAudio("chooseOp")
        if (this._view.nodePassword.getComponent(cc.EditBox).string != this._view.nodeRePassword.getComponent(cc.EditBox).string) {
            UIManager.instance.LoadTipsByStr("请确认密码是否一致。")
            return
        }
        // if (!this._view.nodeNickname.getComponent(cc.EditBox).string) {
        //     UIManager.instance.LoadTipsByStr("昵称不能为空。")
        //     return
        // }
        if (!this._view.nodeName.getComponent(cc.EditBox).string) {
            UIManager.instance.LoadTipsByStr("真实姓名不能为空。")
            return
        }
        if (!this.isChineseOnly(this._view.nodeName.getComponent(cc.EditBox).string)) {
            UIManager.instance.LoadTipsByStr("请检查您的真实姓名是否正确。")
            return
        }
        if (!this._view.nodeId.getComponent(cc.EditBox).string) {
            UIManager.instance.LoadTipsByStr("身份证号不能为空。")
            return
        }
        if (!this._view.nodePassword.getComponent(cc.EditBox).string) {
            UIManager.instance.LoadTipsByStr("密码不能为空。")
            return
        }
        if (this._view.nodePassword.getComponent(cc.EditBox).string.length < 3) {
            UIManager.instance.LoadTipsByStr("您的密码少于3位。")
            return
        }
        if (!this._view.nodeUserId.getComponent(cc.EditBox).string) {
            UIManager.instance.LoadTipsByStr("账号不能为空。")
            return
        }
        if (!this.isAlphanumeric(this._view.nodeUserId.getComponent(cc.EditBox).string)) {
            UIManager.instance.LoadTipsByStr("账号只可由字母和数字组成。")
            return
        }
        let age = MainManager.instance.getAgeFromID(this._view.nodeId.getComponent(cc.EditBox).string)
        if (age < 1) {
            UIManager.instance.LoadTipsByStr("请检查您的身份证信息是否正确。")
            return
        }
        if (age < 12) {
            UIManager.instance.LoadMessageBox("提示", "由于您是未成年人（未满12周岁），根据国家新闻出版署《关于防止未成年人沉迷网络游戏的通知》和《关于进一步严格管理 切实防止未成年人沉迷网络游戏的通知》的要求，以及我司规定，为保护未成年人身心健康，本游戏禁止未满12岁的未成年人注册，请退出。", () => {
                cc.game.end()
            }, null, false)
            return
        }
        let data = {
            requestCode: "register",
            nickName: "玩家",// this._view.nodeNickname.getComponent(cc.EditBox).string,
            userName: this._view.nodeName.getComponent(cc.EditBox).string,
            account: this._view.nodeUserId.getComponent(cc.EditBox).string,
            password: this._view.nodePassword.getComponent(cc.EditBox).string,
            shenFenZheng: this._view.nodeId.getComponent(cc.EditBox).string,
        }
        HttpManager.instance.newRequest(`${Config.serverIP}`, data).then((res: any) => {
            cc.log(res)
            if (res.code == -1) {
                UIManager.instance.LoadTipsByStr(res.msg)
                return
            }
            if (age >= 12 && age < 18) {
                UIManager.instance.LoadMessageBox("提示", "您的身份证号验证成功，由于您是未成年人，根据国家新闻出版署《关于防止未成年人沉迷网络游戏的通知》和《关于进一步严格管理 切实防止未成年人沉迷网络游戏的通知》的要求，将被纳入防沉迷系统，您仅可在周五、周六、周日和法定节假日每日的20时至21时游戏。", () => {

                }, null, false)
            }
            UIManager.instance.LoadTipsByStr("注册成功。")
            this.hideUI()
            DD.instance.saveNewData(this._view.nodeUserId.getComponent(cc.EditBox).string,
                "玩家",
                this._view.nodeId.getComponent(cc.EditBox).string
            )
            HomeUI.instance.showUI()
        })

    }
    refreshUI() {

    }
    hideUI() {
        AudioManager.instance.playAudio('card_down')
        this._view.content.active = false
    }
    isAlphanumeric(str) {
        return /^[A-Za-z0-9]+$/.test(str);
    }
    isChineseOnly(str) {
        const chineseRegex = /^[\u4e00-\u9fa5]+$/;
        return chineseRegex.test(str);
    }
}
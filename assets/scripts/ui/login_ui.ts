import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import LoginUIView from "../ui_view/panel/login_ui_view"
import UIManager from "../manager/ui_manager"
import BigMsgBoxUI from "./big_msg_box_ui"
import { Config } from "../utils/config"
import RegisterUI from "./register_ui"
import HttpManager from "../manager/http_manager"
import HomeUI from "./home_ui"
import DD from "../manager/dynamic_data_manager"
import StorageManager from "../manager/storage_manager"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class LoginUI extends cc.Component {
    static instance: LoginUI = null
    _view: LoginUIView = new LoginUIView()
    loading: boolean = false
    login: boolean = false
    timer: number = 0
    onLoad() {
        this._view.initView(this.node)
        LoginUI.instance = this
        this._bindEvent()
        this._view.nodePerLogin.active = true
    }
    private _bindEvent() {
        //this._view.btnBack.node.on("click", this.hideUI, this)
        this._view.btnWeichengnian.node.on("click", this.onClickWeichengNian, this)
        this._view.btnLogin.node.on("click", this.onClickLogin, this)
        this._view.btnRegister.node.on("click", this.onClickRegisrer, this)
        this._view.btnUserPact.node.on("click", this.onClickUserPact, this)
        this._view.btnRegister.node.on("click", this.onClickRegisrer, this)
        this._view.btnYinsiProtect.node.on("click", this.onClickYinsiProtect, this)
    }
    protected update(dt: number): void {
        this.timer += dt
        if (this.timer > 3) {
            this._view.nodePerLogin.active = false
        }
    }
    showUI() {
        AudioManager.instance.playBGM("start")
        ActionManager.instance.fadeShowDialog(this._view.content)
    }
    refreshUI() {

    }
    hideUI() {
        this._view.content.active = false
    }
    onClickWeichengNian() {
        UIManager.instance.openUI(BigMsgBoxUI, {
            name: Config.uiName.bigMsgBox, param: [
                "适龄提示",
                0
            ]
        })
    }
    onClickLogin() {
        AudioManager.instance.playAudio('click')
        if (!this._view.nodeCheckbox.getComponent(cc.Toggle).isChecked) {
            UIManager.instance.LoadTipsByStr("请阅读并同意《用户协议》和《隐私保护协议》。")
            return
        }
        AudioManager.instance.playAudio("chooseOp")
        if (!this._view.nodeUserId.getComponent(cc.EditBox).string) {
            UIManager.instance.LoadTipsByStr("账号不能为空。")
            return
        }
        if (!this._view.nodePassword.getComponent(cc.EditBox).string) {
            UIManager.instance.LoadTipsByStr("密码不能为空。")
            return
        }
        HttpManager.instance.newRequest(`${Config.serverIP}`, {
            requestCode: "login",
            account: this._view.nodeUserId.getComponent(cc.EditBox).string,
            password: this._view.nodePassword.getComponent(cc.EditBox).string,
            ip: HomeUI.instance.getOrCreateUUID()
        }).then((res: any) => {
            if (res.code == -1) {
                UIManager.instance.LoadTipsByStr(res.msg)
                return
            } else if (res.code == -2) {
                UIManager.instance.LoadMessageBox("提示", res.msg, (isOK) => { cc.game.end() }, null, false)
                return
            }
            UIManager.instance.LoadTipsByStr("登录成功。")
            //  StorageManager.instance.saveDataByKey("linshi", DD.instance.playerData)
            if (res.code == 1) {
                DD.instance.saveNewData(this._view.nodeUserId.getComponent(cc.EditBox).string,
                    res.nickName,
                    res.uid
                )
            } else {
                DD.instance.initData(res.saveData)
            }
            this.hideUI()
            HomeUI.instance.showUI()
        })



    }
    onClickRegisrer() {
        UIManager.instance.openUI(RegisterUI, { name: Config.uiName.registerUI })
    }
    onClickUserPact() {
        UIManager.instance.openUI(BigMsgBoxUI, {
            name: Config.uiName.bigMsgBox, param: [
                "用户协议",
                1
            ]
        })
    }
    onClickYinsiProtect() {
        UIManager.instance.openUI(BigMsgBoxUI, {
            name: Config.uiName.bigMsgBox, param: [
                "隐私保护协议",
                2
            ]
        })
    }
}
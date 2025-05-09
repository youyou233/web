import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import HomeUIView from "../ui_view/panel/home_ui_view"
import UIManager from "../manager/ui_manager"
import SettingUI from "./setting_ui"
import { Config } from "../utils/config"
import DD from "../manager/dynamic_data_manager"
import { MessageType } from "../utils/message"
import ResourceManager from "../manager/resources_manager"
import { ResType } from "../utils/enum"
import ShopUI from "./shop_ui"
import LoginUI from "./login_ui"
import HttpManager from "../manager/http_manager"
import SignUI from "./sign_ui"
import GameManager from "../manager/game_manager"
import OfflineUI from "./offline_ui"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class HomeUI extends cc.Component {
    static instance: HomeUI = null
    private _view: HomeUIView = new HomeUIView()
    onLoad() {
        this._view.initView(this.node)
        HomeUI.instance = this
        this._bindEvent()
        cc.tween(this._view.sprUnlimite.node)
            .repeatForever(cc.tween().to(1.5, { angle: 360 }, cc.easeBackInOut())
                .delay(1).call(() => {
                    this._view.sprUnlimite.node.angle = 0
                })).start()
    }
    private _bindEvent() {

        // this._view.btnSign.node.on("click", () => {
        //     UIManager.instance.openUI(SignUI, { name: Config.uiName.signUI })
        // }, this)
        // this._view.btnSetting.node.on("click", () => {
        //     UIManager.instance.openUI(SettingUI, { name: Config.uiName.settingUI })
        // }, this)
        // this._view.btnDaliy.node.on("click", () => {
        //     AudioManager.instance.playAudio("click")
        //     DD.instance.onDaliy()
        // }, this)
        // this._view.btnShop.node.on("click", () => {
        //     UIManager.instance.openUI(ShopUI, { name: Config.uiName.shopUI, param: [3] })
        // }, this)
        Emitter.register(MessageType.diamondChange, () => {
            this.refreshUI()
        }, this)
        Emitter.register(MessageType.moneyChange, () => {

            this.refreshUI()
        }, this)
        Emitter.register(MessageType.healthChange, () => {
            this.refreshUI()
        }, this)

        this._view.btnBuyMoney.node.on("click", () => {
            UIManager.instance.openUI(ShopUI, { name: Config.uiName.shopUI, param: [1] })
        }, this)
        this._view.btnBuyDiamond.node.on("click", () => {
            UIManager.instance.openUI(ShopUI, { name: Config.uiName.shopUI, param: [2] })
        }, this)
        this._view.nodeBuildContainer.children.forEach((node, index) => {
            node.getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSprite(ResType.main, "build-" + (index + 1))
            node.on("click", () => {
                this.onClickBuild(index)
            })
        })
        this._view.btnStart.node.on("click", this.onClickStart, this)
        this._view.btnUnlimite.node.on("click", this.onClickUnlimite, this)
      
        this._view.btnFarmer.node.on("click", this.onClickFarmer, this)

        setInterval(() => {
            if (!UIManager.instance.checkUIIsOpen(LoginUI)) {
                this.checkOutofGame()
            }
        }, 5000);
    }
    showUI() {
        ActionManager.instance.fadeShowDialog(this._view.content)
        AudioManager.instance.playBGM("home")
        this.refreshUI()
    }
    refreshUI() {
        this._view.nodeBuildContainer.children.forEach((node, index) => {
            node.getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSprite(ResType.main, "build-" + (index + 1))
        })
        this._view.labDiamond.string = Utils.getLargeNumStr(DD.instance.playerData.diamond)
        this._view.labMoney.string = Utils.getLargeNumStr(DD.instance.playerData.money)
        this._view.labHealth.string = Utils.getLargeNumStr(DD.instance.playerData.health)

    }
    hideUI() {
        this._view.content.active = false
    }
    onClickStart() {
        AudioManager.instance.playAudio("Win")
        this.hideUI()
        GameManager.instance.init()

    }

    checkOutofGame() {
        DD.instance.checkKick()

        HttpManager.instance.newRequest(`${Config.serverIP}`,
            { requestCode: "iAmAlive", account: DD.instance.playerData.id, ip: this.getOrCreateUUID() })
            .then((res: any) => {
                if (res.code == -1) {
                    UIManager.instance.LoadMessageBox("提示", res.msg, (isOK) => {
                        cc.game.end()
                    }, null, false)
                    return
                }
            })
    }
    getOrCreateUUID() {
        let uuid = cc.sys.localStorage.getItem('deviceUUID');
        if (!uuid) {
            uuid = this.generateUUID();
            cc.sys.localStorage.setItem('deviceUUID', uuid);
        }
        return uuid;
    }
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    onClickUnlimite() {
        AudioManager.instance.playAudio("Win")
        this.hideUI()
        GameManager.instance.init(null,true)
        // UIManager.instance.openUI(LevelChooseUI, { name: Config.uiName.levelChooseUI })
    }
    onClickBuild(index) {
        let buildType = index + 1
        switch (buildType) {
            default:
              //  UIManager.instance.openUI(BuildUI, { name: Config.uiName.buildUI, param: [buildType] })
                break
        }
    }
    onClickFarmer() {
       // UIManager.instance.openUI(RoleChooseUI, { name: Config.uiName.roleChooseUI })
    }
}
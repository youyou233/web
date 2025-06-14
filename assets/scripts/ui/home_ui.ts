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
import RoleChooseUI from "./role_choose_ui"
import FlyChooseUI from "./fly_choose_ui"
import LevelChooseUI from "./level_choose_ui"
import SceneChooseUI from "./scene_choose_ui"


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

        this._view.btnSign.node.on("click", () => {
            UIManager.instance.openUI(SignUI, { name: Config.uiName.signUI })
        }, this)
        this._view.btnSetting.node.on("click", () => {
            UIManager.instance.openUI(SettingUI, { name: Config.uiName.settingUI })
        }, this)
        this._view.btnDaliy.node.on("click", () => {
            AudioManager.instance.playAudio("click")
            DD.instance.onDaliy()
        }, this)
        this._view.btnShop.node.on("click", () => {
            UIManager.instance.openUI(ShopUI, { name: Config.uiName.shopUI, param: [1] })
        }, this)
        Emitter.register(MessageType.diamondChange, () => {
            this.refreshUI()
        }, this)
        Emitter.register(MessageType.moneyChange, () => {

            this.refreshUI()
        }, this)
        Emitter.register(MessageType.equipFly, () => {

            this.refreshUI()
        }, this)
        Emitter.register(MessageType.equipRole, () => {

            this.refreshUI()
        }, this)
        Emitter.register(MessageType.healthChange, () => {
            this.refreshUI()
        }, this)
        Emitter.register(MessageType.changeName, () => {
            this._view.labName.string = DD.instance.playerData.nickName
        }, this)
        this._view.btnBuyMoney.node.on("click", () => {
            UIManager.instance.openUI(ShopUI, { name: Config.uiName.shopUI, param: [1] })
        }, this)
        this._view.btnBuyDiamond.node.on("click", () => {
            UIManager.instance.openUI(ShopUI, { name: Config.uiName.shopUI, param: [2] })
        }, this)
        this._view.btnFarmer.node.on("click", () => {
            UIManager.instance.openUI(RoleChooseUI, { name: Config.uiName.roleChooseUI })
        }, this)
        this._view.btnHelper.node.on("click", () => {
            UIManager.instance.openUI(FlyChooseUI, { name: Config.uiName.flyChooseUI })
        }, this)
        this._view.btnScene.node.on("click", () => {
            UIManager.instance.openUI(SceneChooseUI, { name: Config.uiName.SceneChooseUI })
        }, this)
        this._view.btnStart.node.on("click", this.onClickStart, this)
        this._view.btnUnlimite.node.on("click", this.onClickUnlimite, this)
        this._view.btnBuyHealth.node.on("click", () => {
            if (DD.instance.playerData.health >= 100) {
                UIManager.instance.LoadTipsByStr("体力已满，无需兑换。")
                return
            }
            if (DD.instance.playerData.diamond < 10) {
                UIManager.instance.LoadTipsByStr("会员卡不足10张，无法兑换体力。")
                return
            } else {
                UIManager.instance.LoadMessageBox("提示", "是否花费10张会员卡兑换50点体力？", (isOK) => {
                    if (isOK) {
                        AudioManager.instance.playAudio("click")
                        DD.instance.addDiamond(-10)
                        DD.instance.addHealth(50)
                        this.refreshUI()
                    }
                })
            }
        }, this)
        Emitter.register(MessageType.changeScene, () => {

            let homeLv = DD.instance.playerData.scene || 1
            ResourceManager.instance.getBackGround("home" + homeLv).then((res: cc.SpriteFrame) => {
                this._view.sprBackground.spriteFrame = res
            })
        }, this)
        setInterval(() => {
            if (!UIManager.instance.checkUIIsOpen(LoginUI)) {
                this.checkOutofGame()
            }
        }, 5000);
    }
    showUI() {
        ActionManager.instance.fadeShowDialog(this._view.content)
        AudioManager.instance.playBGM("home")
        let homeLv = DD.instance.playerData.scene || 1
        ResourceManager.instance.getBackGround("home" + homeLv).then((res: cc.SpriteFrame) => {
            this._view.sprBackground.spriteFrame = res
        })
        this.refreshUI()
    }
    refreshUI() {
        this._view.labDiamond.string = Utils.getLargeNumStr(DD.instance.playerData.diamond)
        this._view.labMoney.string = Utils.getLargeNumStr(DD.instance.playerData.money)
        this._view.labHealth.string = Utils.getLargeNumStr(DD.instance.playerData.health) + "/100"
        this._view.sprHealthPro.fillRange = DD.instance.playerData.health / 100
        this._view.labName.string = DD.instance.playerData.nickName
        this._view.labMaxLv.string = "积分" + DD.instance.playerData.maxLevel
        this._view.sprPlayer.spriteFrame = ResourceManager.instance.getSprite(ResType.main, `a-${DD.instance.playerData.roleEquip}`)

        this._view.btnBuyHealth.interactable = DD.instance.playerData.health < 100
        //  this._view.sprFarmer.spriteFrame = ResourceManager.instance.getSprite(ResType.main, `农民-${DD.instance.playerData.roleEquip}`)
        //  this._view.sprHelper.spriteFrame = ResourceManager.instance.getSprite(ResType.main, `道具-prop_${DD.instance.playerData.flyEquip}`)
    }
    hideUI() {
        this._view.content.active = false
    }
    onClickStart() {
        AudioManager.instance.playAudio("Win")
        if (DD.instance.playerData.health < 5) {
            UIManager.instance.LoadTipsByStr("体力不足。")
            return
        }
        UIManager.instance.openUI(LevelChooseUI, { name: Config.uiName.levelChooseUI })
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
        if (DD.instance.playerData.health < 5) {
            UIManager.instance.LoadTipsByStr("体力不足。")
        }
        this.hideUI()
        DD.instance.addHealth(-5)
        GameManager.instance.init(null, true)
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

}
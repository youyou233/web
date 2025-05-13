import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import ShopUIView from "../ui_view/panel/shop_ui_view"
import { MessageType } from "../utils/message"
import DD from "../manager/dynamic_data_manager"
import ResourceManager from "../manager/resources_manager"
import { ResType } from "../utils/enum"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class ShopUI extends cc.Component {
    static instance: ShopUI = null
    private _view: ShopUIView = new ShopUIView()
    get type() {
        if (this._view.svMoney.node.active) {
            return 1
        } else if (this._view.svDiamond.node.active) {
            return 2
        } else {
            return 3
        }
    }
    onLoad() {
        this._view.initView(this.node)
        ShopUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
        this._view.btnBack.node.on("click", this.hideUI, this)
        this._view.btnDiamond.node.on("click", () => {
            AudioManager.instance.playAudio("chooseOp")
            this.chooseType(2)
        })
        this._view.btnMoney.node.on("click", () => {
            AudioManager.instance.playAudio("chooseOp")
            this.chooseType(1)
        })
        Emitter.register(MessageType.diamondChange, () => {
            this._view.labDiamond.string = DD.instance.playerData.diamond.toFixed(0)
        }, this)
        Emitter.register(MessageType.moneyChange, () => {
            this._view.labMoney.string = DD.instance.playerData.money.toFixed(0)
        }, this)
    }
    showUI(type: number = 3) {
        AudioManager.instance.playAudio('card_up')
        ActionManager.instance.fadeShowDialog(this._view.content)
        this.chooseType(type)
    }
    chooseType(type) {
        this._view.sprCur.spriteFrame = ResourceManager.instance.getSprite(ResType.main, ["Sprites-Common-Icons-Coin", "Sprites-Common-Icons-Gem"][type - 1])
        this._view.labTitle.string = ["金币商店", "会员商店", "道具商店"][type - 1]
        this._view.svDiamond.node.active = false
        this._view.svMoney.node.active = false
        this._view.btnDiamond.node.getChildByName("check").active = false
        this._view.btnMoney.node.getChildByName("check").active = false
        if (type == 1) {
            this._view.svMoney.node.active = true
            this._view.btnMoney.node.getChildByName("check").active = true
        } else if (type == 2) {
            this._view.svDiamond.node.active = true
            this._view.btnDiamond.node.getChildByName("check").active = true
        } 
        this._view.labDiamond.string = DD.instance.playerData.diamond.toFixed(0)
        this._view.labMoney.string = DD.instance.playerData.money.toFixed(0)
    }
    refreshUI() {

    }
    hideUI() {
        AudioManager.instance.playAudio('card_down')
        this._view.content.active = false
    }
}
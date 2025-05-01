
import AudioManager from "../manager/audio_manager"
import DD from "../manager/dynamic_data_manager"
import GameManager from "../manager/game_manager"
import JsonManager from "../manager/json_manager"
import ResourceManager from "../manager/resources_manager"
import UIManager from "../manager/ui_manager"
import LevelupUI from "../ui/levelup_ui"
import RoleChooseUI from "../ui/role_choose_ui"
import ItemRoleChooseView from "../ui_view/item/item_role_choose_view"
import { Config } from "../utils/config"
import {  ResType } from "../utils/enum"
import { Utils } from "../utils/utils"


const { ccclass, property } = cc._decorator

@ccclass
export default class ItemRoleChoose extends cc.Component {
    _view: ItemRoleChooseView = new ItemRoleChooseView()

    id: number = 0
    protected onLoad(): void {
        this._view.initView(this.node)
        this.bindEvent()
    }
    bindEvent() {
        this._view.btnChoose.node.on("click", this.onClickLevelup, this)
        this._view.btnUnlock.node.on("click", this.onClickUnlock, this)
    }
    init(id: number) {
        this.id = id
        // this._view.nodeChoose.active = id == DD.instance.playerData.roleEquip
        // this._view.labEquip.node.active = id == DD.instance.playerData.roleEquip
        this._view.sprMain.spriteFrame = ResourceManager.instance.getSprite(ResType.main, `role-${id}`)
        Utils.setSpScale(this._view.sprMain.node, 112)
        let info = JsonManager.instance.getDataByName("farmer")[id]
        this._view.labName.string = info.name
        let param = info.skill * (DD.instance.playerData.roleMap[id] || 0)
        if (param == 0) {
            param = info.skill
        }
        let price = [0, 100, 500, 200, 500, 1000]
        this._view.labDec.string = Utils.getText(info.dec, param)
        this._view.btnUnlock.node.active = !DD.instance.playerData.roleMap[id]
        if (this.id <= 2) {
            this._view.sprUnlock.spriteFrame = ResourceManager.instance.getSprite(ResType.main, "Sprites-Panels-Shop-Icons-Coin")
            this._view.labUnlock.string = price[this.id] + "\n解锁"
            this._view.labUnlock.node.color = DD.instance.playerData.money >= price[this.id] ? cc.Color.WHITE : cc.Color.RED
        } else {
            this._view.sprUnlock.spriteFrame = ResourceManager.instance.getSprite(ResType.main, "Sprites-Panels-Shop-Icons-Gem")
            this._view.labUnlock.string = price[this.id] + "\n解锁"
            this._view.labUnlock.node.color = DD.instance.playerData.diamond >= price[this.id] ? cc.Color.WHITE : cc.Color.RED
        }
      //  this._view.btnChoose.node.active = DD.instance.playerData.roleMap[id] && DD.instance.playerData.roleMap[id] < DD.instance.playerData.buildMap[BuildType.工具间]

        this._view.labLevel.string = DD.instance.playerData.roleMap[id] ? (DD.instance.playerData.roleMap[id] + "级工具") : "未解锁"

    }
    onClickUnlock() {
        AudioManager.instance.playAudio("click")
        let price = [0, 100, 500, 200, 500, 1000]
        if (this.id <= 2) {
            if (DD.instance.playerData.money >= price[this.id]) {
                UIManager.instance.LoadMessageBox("确认", "是否花费" + price[this.id] + "金币解锁该农夫？", (isOk) => {
                    if (isOk) {
                        DD.instance.unlockRole(this.id)
                        this.init(this.id)
                    }
                })
            } else {
                UIManager.instance.LoadTipsByStr("金币不足。")
            }
        } else {
            if (DD.instance.playerData.diamond >= price[this.id]) {
                UIManager.instance.LoadMessageBox("确认", "是否花费" + price[this.id] + "钻石解锁该农夫？", (isOk) => {
                    if (isOk) {
                        DD.instance.unlockRole(this.id)
                        this.init(this.id)
                    }
                })
            } else {
                UIManager.instance.LoadTipsByStr("钻石不足。")
            }
        }

    }
    onClickLevelup() {
        // AudioManager.instance.playAudio("click")
        RoleChooseUI.instance.hideUI()
       // UIManager.instance.openUI(LevelupUI, { name: Config.uiName.levelupUI })
    }
}
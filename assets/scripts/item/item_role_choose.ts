
import AudioManager from "../manager/audio_manager"
import DD from "../manager/dynamic_data_manager"
import JsonManager from "../manager/json_manager"
import ResourceManager from "../manager/resources_manager"
import UIManager from "../manager/ui_manager"
import ItemRoleChooseView from "../ui_view/item/item_role_choose_view"
import { ResType } from "../utils/enum"


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
        this._view.btnChoose.node.on("click", this.onClickEquip, this)
        this._view.btnUnlock.node.on("click", this.onClickUnlock, this)
        this._view.btnLevelUp.node.on("click", this.onClickLevelup, this)
    }
    init(id: number) {
        this.id = id
        this._view.nodeChoose.active = id == DD.instance.playerData.roleEquip
        this._view.labEquip.node.active = id == DD.instance.playerData.roleEquip
        this._view.sprMain.spriteFrame = ResourceManager.instance.getSprite(ResType.main, `a-${id}`)
        let info = JsonManager.instance.getDataByName("hero")[id]
        this._view.labName.string = info.name
        this._view.labDec.string = info.dec
        this._view.btnUnlock.node.active = !DD.instance.playerData.roleMap[id]
        this._view.btnChoose.node.active = DD.instance.playerData.roleMap[id] && DD.instance.playerData.roleEquip != id

        this._view.labLevel.string = DD.instance.playerData.roleMap[id] ? (DD.instance.playerData.roleMap[id] + "级") : "未解锁"
        this._view.btnLevelUp.node.active = DD.instance.playerData.roleMap[id]
        this._view.labPrice.string = (DD.instance.playerData.roleMap[id] * 100) + ""

        this._view.labUnlock.string = ((id - 1) * 100) + "\n解锁"
    }
    onClickUnlock() {
        let cost = (this.id - 1) * 100
        if (DD.instance.playerData.diamond >= cost) {
            UIManager.instance.LoadMessageBox("确认", "是否花费" + cost + "会员卡解锁该角色", (isOk) => {
                if (isOk) {
                    UIManager.instance.LoadTipsByStr("解锁成功。")
                    DD.instance.unlockRole(this.id)
                    this.init(this.id)
                }
            })
        } else {
            AudioManager.instance.playAudio("click")
            UIManager.instance.LoadTipsByStr("会员卡不足。")
        }
    }
    onClickLevelup() {
        AudioManager.instance.playAudio("click")
        if (DD.instance.playerData.money >= (DD.instance.playerData.roleMap[this.id] * 100)) {
            DD.instance.onLevelup(this.id)
            UIManager.instance.LoadTipsByStr("升级成功。")
        } else {
            UIManager.instance.LoadTipsByStr("金币不足。")
        }
    }
    onClickEquip() {
        AudioManager.instance.playAudio("click")
        DD.instance.equipRole(this.id)
    }
}
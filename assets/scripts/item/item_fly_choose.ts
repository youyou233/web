
import AudioManager from "../manager/audio_manager"
import DD from "../manager/dynamic_data_manager"
import JsonManager from "../manager/json_manager"
import ResourceManager from "../manager/resources_manager"
import UIManager from "../manager/ui_manager"
import ItemFlyChooseView from "../ui_view/item/item_fly_choose_view"
import { ResType } from "../utils/enum"


const { ccclass, property } = cc._decorator

@ccclass
export default class ItemFlyChoose extends cc.Component {
    _view: ItemFlyChooseView = new ItemFlyChooseView()
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
        this._view.nodeChoose.active = id == DD.instance.playerData.flyEquip
        this._view.labEquip.node.active = id == DD.instance.playerData.flyEquip
        this._view.sprMain.spriteFrame = ResourceManager.instance.getSprite(ResType.main, `道具-prop_${id}`)
        let info = JsonManager.instance.getDataByName("fly")[id]
        this._view.labName.string = info.name
        this._view.labDec.string = info.dec
        this._view.btnUnlock.node.active = !DD.instance.playerData.flyMap[id]
        this._view.btnChoose.node.active = DD.instance.playerData.flyMap[id] && DD.instance.playerData.flyEquip != id
        this._view.labLevel.string = DD.instance.playerData.flyMap[id] ? (DD.instance.playerData.flyMap[id] + "级") : "未解锁"
        this._view.btnLevelUp.node.active = DD.instance.playerData.flyMap[id]
        this._view.labPrice.string = (DD.instance.playerData.flyMap[id] * 100) + ""
        this._view.labUnlock.string = ((id - 1) * 100) + "\n解锁"
    }
    onClickLevelup() {
        AudioManager.instance.playAudio("click")
        if (DD.instance.playerData.money >= (DD.instance.playerData.flyMap[this.id] * 100)) {
            DD.instance.onLevelupFly(this.id)
            UIManager.instance.LoadTipsByStr("升级成功。")
        } else {
            UIManager.instance.LoadTipsByStr("金币不足。")
        }
    }
    onClickUnlock() {
        let cost = (this.id - 1) * 100
        if (DD.instance.playerData.diamond >= cost) {
            UIManager.instance.LoadMessageBox("确认", "是否花费" + cost + "会员卡解锁该工具", (isOk) => {
                if (isOk) {
                    UIManager.instance.LoadTipsByStr("解锁成功。")
                    DD.instance.unlockFly(this.id)
                    this.init(this.id)
                }
            })
        } else {
            AudioManager.instance.playAudio("click")
            UIManager.instance.LoadTipsByStr("会员卡不足。")
        }
    }
    onClickEquip() {

        AudioManager.instance.playAudio("click")
        DD.instance.equipFly(this.id)
    }
}
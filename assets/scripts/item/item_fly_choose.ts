
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
        this._view.sprMain.spriteFrame = ResourceManager.instance.getSprite(ResType.main, `weapon-weapon (${id})`)
        let info = JsonManager.instance.getDataByName("fly")[id]
        this._view.labName.string = info.name
        this._view.labDec.string = info.dec
        this._view.btnUnlock.node.active = !DD.instance.playerData.flyMap[id]
        this._view.btnChoose.node.active = DD.instance.playerData.flyMap[id] && DD.instance.playerData.flyEquip != id
        this._view.labLevel.string = DD.instance.playerData.flyMap[id] ? (DD.instance.playerData.flyMap[id] + "级") : "未解锁"
        this._view.btnLevelUp.node.active = DD.instance.playerData.flyMap[id]
        this._view.labPrice.string = (DD.instance.playerData.flyMap[id] * 100) + ""
    }
    onClickLevelup() {
        AudioManager.instance.playAudio("click")
        if (DD.instance.playerData.money >= (DD.instance.playerData.flyMap[this.id] * 100)) {
            DD.instance.onLevelup(this.id)
            UIManager.instance.LoadTipsByStr("升级成功。")
        } else {
            UIManager.instance.LoadTipsByStr("金币不足。")
        }
    }
    onClickUnlock() {
        if (DD.instance.playerData.diamond >= 100) {
            UIManager.instance.LoadMessageBox("确认", "是否花费100卡券解锁该帮手", (isOk) => {
                if (isOk) {
                    DD.instance.unlockFly(this.id)
                    this.init(this.id)
                }
            })
        } else {
            AudioManager.instance.playAudio("click")
            UIManager.instance.LoadTipsByStr("卡券不足")
        }
    }
    onClickEquip() {

        AudioManager.instance.playAudio("click")
        DD.instance.equipFly(this.id)
    }
}
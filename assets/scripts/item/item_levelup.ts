
import AudioManager from "../manager/audio_manager"
import DD from "../manager/dynamic_data_manager"
import JsonManager from "../manager/json_manager"
import ResourceManager from "../manager/resources_manager"
import UIManager from "../manager/ui_manager"
import ItemLevelupView from "../ui_view/item/item_levelup_view"
import { ResType } from "../utils/enum"
import { Utils } from "../utils/utils"


const { ccclass, property } = cc._decorator

@ccclass
export default class ItemLevelUp extends cc.Component {
    _view: ItemLevelupView = new ItemLevelupView()
    id: number = 0
    type: number = 1
    protected onLoad(): void {
        this._view.initView(this.node)
        this.bindEvent()
    }
    bindEvent() {
        this._view.btnLevelup.node.on("click", this.onClick, this)
    }
    init(id, type) {
        this.id = id
        this.type = type
        let info = JsonManager.instance.getDataByName("farmer")[id]
        this._view.labName.string = info.name
        this._view.sprMain.spriteFrame = ResourceManager.instance.getSprite(ResType.main,
            `role-${id}`
        )
        this._view.labLevel.string = DD.instance.playerData.roleMap[id] + "级"
        let skillNum = DD.instance.playerData.roleMap[id] * info.skill
        if (skillNum == 0) skillNum = info.skill
        this._view.labDec.string = Utils.getText(info.dec, skillNum)
        this._view.labPrice.string = (DD.instance.playerData.roleMap[id] * 100) + "\n升级"
        this._view.labPrice.node.color = DD.instance.playerData.money >= (DD.instance.playerData.roleMap[id] * 100) ? cc.Color.WHITE : cc.Color.RED
        this._view.btnLevelup.node.active = true
        if (this.id == 5 && DD.instance.playerData.roleMap[id] >= 100) {
            this._view.btnLevelup.node.active = false
        }
    }
    onClick() {
        AudioManager.instance.playAudio("click")
        if (DD.instance.playerData.money >= (DD.instance.playerData.roleMap[this.id] * 100)) {
            DD.instance.onLevelup(this.id)
            UIManager.instance.LoadTipsByStr("升级成功。")
        } else {
            UIManager.instance.LoadTipsByStr("金币不足。")
        }

    }
}
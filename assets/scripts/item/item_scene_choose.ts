
import AudioManager from "../manager/audio_manager"
import DD from "../manager/dynamic_data_manager"
import JsonManager from "../manager/json_manager"
import ResourceManager from "../manager/resources_manager"
import UIManager from "../manager/ui_manager"
import ItemSceneChooseView from "../ui_view/item/item_scene_choose_view"
import { ResType } from "../utils/enum"


const { ccclass, property } = cc._decorator

@ccclass
export default class ItemSceneChoose extends cc.Component {
    _view: ItemSceneChooseView = new ItemSceneChooseView()
    id: number = 0
    protected onLoad(): void {
        this._view.initView(this.node)
        this.bindEvent()
    }
    bindEvent() {
        this._view.btnChoose.node.on("click", this.onClickEquip, this)
    }
    init(id: number) {
        this.id = id
        let name = ["初始庭院", "南瓜庭院", "雪地庭院", "美食庭院", "蔬果庭院"]
        this._view.labName.string = name[id - 1]
        let needPassLv = [0, 15, 35, 70, 100]
        let curScnene = DD.instance.playerData.scene || 1
        this._view.nodeChoose.active = id == curScnene
        this._view.labEquip.node.active = id == curScnene
        this._view.labUnlock.string = ""
        this._view.btnChoose.node.active = DD.instance.playerData.maxLevel >= needPassLv[this.id - 1] && curScnene != id
        if (DD.instance.playerData.maxLevel < needPassLv[this.id - 1]) {
            this._view.labUnlock.string = "通过" + needPassLv[this.id - 1] + "关卡解锁。"
        }

    }
    onClickEquip() {

        AudioManager.instance.playAudio("click")
        DD.instance.changeScene(this.id)
    }
}
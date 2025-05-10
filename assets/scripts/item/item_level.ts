
import AudioManager from "../manager/audio_manager"
import DD from "../manager/dynamic_data_manager"
import UIManager from "../manager/ui_manager"
import GameUI from "../ui/game_ui"
import HomeUI from "../ui/home_ui"
import LevelChooseUI from "../ui/level_choose_ui"
import ItemLevelView from "../ui_view/item/item_level_view"


const { ccclass, property } = cc._decorator

@ccclass
export default class ItemLevel extends cc.Component {
    _view: ItemLevelView = new ItemLevelView()
    level: number = 0
    protected onLoad(): void {
        this._view.initView(this.node)
        this.bindEvent()
    }
    bindEvent() {
        this.node.on("click", this.onClick, this)
    }
    init(level: number) {
        this.level = level
        this._view.nodeNew.active = level > DD.instance.playerData.maxLevel
        this._view.nodeOld.active = level <= DD.instance.playerData.maxLevel
        this._view.labLevel.string = level + ""

    }
    onClick() {
        AudioManager.instance.playAudio("click")
        // if (DD.instance.playerData.maxLevel >= this.level) {
        //     UIManager.instance.LoadTipsByStr("您已通过该关卡")
        //     return
        // }
        DD.instance.addHealth(-5)
        LevelChooseUI.instance.hideUI()
        HomeUI.instance.hideUI()
        GameUI.instance.initGame(this.level)
    }
}
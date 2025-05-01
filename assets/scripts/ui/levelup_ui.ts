import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import LevelupUIView from "../ui_view/panel/levelup_ui_view"
import DD from "../manager/dynamic_data_manager"
import PoolManager from "../manager/pool_manager"
import JsonManager from "../manager/json_manager"
import ItemLevelUp from "../item/item_levelup"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class LevelupUI extends cc.Component {
    static instance: LevelupUI = null
    private _view: LevelupUIView = new LevelupUIView()
    onLoad() {
        this._view.initView(this.node)
        LevelupUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
        this._view.nodeMask.on("click", this.hideUI, this)
    }
    showUI() {
        AudioManager.instance.playAudio('card_up')
        ActionManager.instance.popOut(this._view.content, this._view.nodeMask)
        this.refreshUI()
    }
    refreshUI() {
        PoolManager.instance.removeObjByContainer(this._view.nodeContainer)
        for (let id in DD.instance.playerData.roleMap) {
            if (DD.instance.playerData.roleMap[id] > 0) {
                let node = PoolManager.instance.createObjectByName("itemLevelup", this._view.nodeContainer)
                node.getComponent(ItemLevelUp).init(id, 1)
            }
        }
    }
    hideUI() {
        AudioManager.instance.playAudio('card_down')
        this._view.content.active = false
    }
}
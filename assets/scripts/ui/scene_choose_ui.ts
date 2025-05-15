import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import PoolManager from "../manager/pool_manager"
import ItemFlyChoose from "../item/item_fly_choose"
import { MessageType } from "../utils/message"
import SceneChooseUIView from "../ui_view/panel/scene_choose_ui_view"
import ItemSceneChoose from "../item/item_scene_choose"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class SceneChooseUI extends cc.Component {
    static instance: SceneChooseUI = null
    private _view: SceneChooseUIView = new SceneChooseUIView()
    onLoad() {
        this._view.initView(this.node)
        SceneChooseUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
        this._view.nodeMask.on("click", this.hideUI, this)
        Emitter.register(MessageType.changeScene, this.refreshUI, this)
    }
    showUI() {
        AudioManager.instance.playAudio('card_up')
        ActionManager.instance.popOut(this._view.content, this._view.nodeMask)
        this.refreshUI()
    }
    refreshUI() {
        PoolManager.instance.removeObjByContainer(this._view.nodeContainer)
        for (let i = 0; i < 5; i++) {
            let node = PoolManager.instance.createObjectByName("itemSceneChoose", this._view.nodeContainer)
            node.getComponent(ItemSceneChoose).init(i + 1)
        }
    }
    hideUI() {
        AudioManager.instance.playAudio('card_down')
        this._view.content.active = false
    }
}
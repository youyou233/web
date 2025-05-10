import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import FlyChooseUIView from "../ui_view/panel/fly_choose_ui_view"
import PoolManager from "../manager/pool_manager"
import ItemFlyChoose from "../item/item_fly_choose"
import { MessageType } from "../utils/message"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class FlyChooseUI extends cc.Component {
    static instance: FlyChooseUI = null
    private _view: FlyChooseUIView = new FlyChooseUIView()
    onLoad() {
        this._view.initView(this.node)
        FlyChooseUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
        this._view.nodeMask.on("click", this.hideUI, this)
        Emitter.register(MessageType.equipFly, this.refreshUI, this)
    }
    showUI() {
        AudioManager.instance.playAudio('card_up')
        ActionManager.instance.popOut(this._view.content, this._view.nodeMask)
        this.refreshUI()
    }
    refreshUI() {
        PoolManager.instance.removeObjByContainer(this._view.nodeContainer)
        for (let i = 0; i < 4; i++) {
            let node = PoolManager.instance.createObjectByName("itemFlyChoose", this._view.nodeContainer)
            node.getComponent(ItemFlyChoose).init(i + 1)
        }
    }
    hideUI() {
        AudioManager.instance.playAudio('card_down')
        this._view.content.active = false
    }
}
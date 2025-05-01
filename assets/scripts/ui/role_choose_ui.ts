import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import RoleChooseUIView from "../ui_view/panel/role_choose_ui_view"
import { MessageType } from "../utils/message"
import PoolManager from "../manager/pool_manager"
import ItemRoleChoose from "../item/item_role_choose"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class RoleChooseUI extends cc.Component {
    static instance: RoleChooseUI = null
    private _view: RoleChooseUIView = new RoleChooseUIView()
    onLoad() {
        this._view.initView(this.node)
        RoleChooseUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
       
        this._view.nodeMask.on("click", this.hideUI, this)
        //Emitter.register(MessageType.equipRole, this.refreshUI, this)
    }
    showUI() {
        AudioManager.instance.playAudio('card_up')
        ActionManager.instance.popOut(this._view.content, this._view.nodeMask)
        this.refreshUI()
    }
    refreshUI() {
        PoolManager.instance.removeObjByContainer(this._view.nodeContainer)
        for (let i = 0; i < 5; i++) {
            let node = PoolManager.instance.createObjectByName("itemRoleChoose", this._view.nodeContainer)
            node.getComponent(ItemRoleChoose).init(i + 1)
        }
    }
    hideUI() {
        AudioManager.instance.playAudio('card_down')
        this._view.content.active = false
    }
}
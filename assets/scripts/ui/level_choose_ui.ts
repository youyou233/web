// import ActionManager from "../manager/action_manager"
// import AudioManager from "../manager/audio_manager"
// import { Utils } from "../utils/utils"
// import { Emitter } from "../utils/emmiter"
// import LevelChooseUIView from "../ui_view/panel/level_choose_ui_view"
// import PoolManager from "../manager/pool_manager"
// import DD from "../manager/dynamic_data_manager"
// import ItemLevel from "../item/item_level"


// const { ccclass, property } = cc._decorator

// //强化页面
// @ccclass
// export default class LevelChooseUI extends cc.Component {
//     static instance: LevelChooseUI = null
//     private _view: LevelChooseUIView = new LevelChooseUIView()
//     onLoad() {
//         this._view.initView(this.node)
//         LevelChooseUI.instance = this
//         this._bindEvent()
//     }
//     private _bindEvent() {
//         this._view.nodeMask.on("click", this.hideUI, this)
//     }
//     showUI() {
//         AudioManager.instance.playAudio('card_up')
//         ActionManager.instance.popOut(this._view.content, this._view.nodeMask)
//         this.refreshUI()
//     }
//     refreshUI() {
//         PoolManager.instance.removeObjByContainer(this._view.nodeContainer)
//         for (let i = DD.instance.playerData.maxLevel; i >= 0; i--) {
//             let node = PoolManager.instance.createObjectByName("itemLevel", this._view.nodeContainer)
//             node.getComponent(ItemLevel).init(i + 1)
//         }
//         setTimeout(() => {
//             this._view.svMain.scrollToTop()
//         }, 100);
//     }
//     hideUI() {
//         AudioManager.instance.playAudio('card_down')
//         this._view.content.active = false
//     }
// }
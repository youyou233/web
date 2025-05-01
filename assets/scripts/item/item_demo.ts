
import AudioManager from "../manager/audio_manager"


const { ccclass, property } = cc._decorator

@ccclass
export default class ItemDemo extends cc.Component {
    _view: any// = new ItemDemoView()
    protected onLoad(): void {
        this._view.initView(this.node)
        this.bindEvent()
    }
    bindEvent() {
        this.node.on("click", this.onClick, this)
    }
    init() {

    }
    onClick() {

    }
}
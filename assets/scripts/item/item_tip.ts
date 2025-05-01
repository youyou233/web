import PoolManager from "../manager/pool_manager"
import ItemTipView from "../ui_view/item/item_tip_view"


const { ccclass, property } = cc._decorator

/**
 * 很多被动 技能的判定
 */
@ccclass
export default class ItemTip extends cc.Component {
    _view: ItemTipView = new ItemTipView()
    diceIndex: number = 0
    num: number = 1
    //判断是哪一个
    protected onLoad(): void {
        this._view.initView(this.node)
    }
    init(name: string) {
        this._view.labName.string = name
        this.showAnima()
    }
    refreshUI() {
        //   this._view.labNum.string = this.num + ""
    }
    showAnima() {
        this._view.nodeContent.stopAllActions()
        this._view.nodeContent.opacity = 0
        this._view.nodeContent.scaleY = 0
        this._view.nodeContent.y = 0
        cc.tween(this._view.nodeContent).to(0.3, { scaleY: 1, opacity: 255 }, cc.easeInOut(3))
            .delay(1.3)
            .to(0.15, { y: 330, opacity: 0 }, cc.easeIn(2))
            .call(() => {
                PoolManager.instance.removeObject(this.node)
            })
            .start()
    }
}
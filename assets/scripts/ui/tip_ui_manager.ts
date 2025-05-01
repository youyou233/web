//import DataManager from "../manager/data_manager";

import ItemTip from "../item/item_tip"
import PoolManager from "../manager/pool_manager"

const { ccclass, property } = cc._decorator

//interface StoreItemCalBack{
//   (itemID:number):void;
//}

@ccclass
export default class TipsUIManager extends cc.Component {
    static instance: TipsUIManager = null

    @property(cc.Node)
    container: cc.Node = null

    onLoad() {
        // console.log("PoolManager Onload");
        TipsUIManager.instance = this
        this.node.zIndex = 999
    }


    showTipsByStr(info: string) {
        let node = PoolManager.instance.createObjectByName("itemTip", this.container)
        node.getComponent(ItemTip).init(info)
    }


}

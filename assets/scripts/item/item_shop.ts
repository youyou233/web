
import AudioManager from "../manager/audio_manager"
import DD from "../manager/dynamic_data_manager"
import HttpManager from "../manager/http_manager"
import MainManager from "../manager/main_manager"
import UIManager from "../manager/ui_manager"
import ShopUI from "../ui/shop_ui"
import ItemShopView from "../ui_view/item/item_shop_view"
import { Config } from "../utils/config"


const { ccclass, property } = cc._decorator

@ccclass
export default class ItemShop extends cc.Component {
    _view: ItemShopView = new ItemShopView()
    protected onLoad(): void {
        this._view.initView(this.node)
        this.bindEvent()
    }
    bindEvent() {
        this._view.btnBuy.node.on("click", this.onClick, this)
    }
    init() {

    }
    onClick() {
        AudioManager.instance.playAudio("click")
        let index = this.node.getSiblingIndex()
        let type = ShopUI.instance.type
        if (type == 1) {
            let price = [6, 30, 68, 128, 328, 648]
            let money = [60, 300, 680, 1280, 3280, 6480]
            if (DD.instance.playerData.diamond >= price[index]) {
                UIManager.instance.LoadMessageBox("确认购买", "是否确认花费" + price[index] + "会员卡购买" + money[index] + "金币", (isOK) => {
                    if (isOK) {
                        UIManager.instance.LoadTipsByStr("购买成功，获得：" + money[index] + "金币")
                        DD.instance.addMoney(money[index])
                        DD.instance.addDiamond(-price[index])
                    }
                })
            } else {
                UIManager.instance.LoadTipsByStr("会员卡不足")
            }
        } else {
            let price = [6, 30, 68, 128, 328, 648]
            let money = [60, 300, 680, 1280, 3280, 6480]
            // let age = MainManager.instance.getAgeFromID(DD.instance.playerData.uid)
            // if (age < 16 && price[index] >= 50) {
            //     UIManager.instance.LoadTipsByStr("12周岁以上未满16周岁的用户，单次充值金额不超过50元人民币。")
            //     return
            // } else if (age < 18 && price[index] >= 100) {
            //     UIManager.instance.LoadTipsByStr("16周岁以上未满18周岁的用户，单次充值金额不超过100元人民币。")
            //     return
            // }
            UIManager.instance.LoadMessageBox("确认购买", "是否确认花费" + price[index] + "人民币购买" + money[index] + "会员卡", (isOK) => {
                if (isOK) {
                    HttpManager.instance.newRequest(`${Config.serverIP}`, {
                        requestCode: "recharge",
                        account: DD.instance.playerData.id,
                        rechargeMoney: price[index]
                    }).then((res: any) => {
                        cc.log(res)
                        if (res.code == -1) {
                            UIManager.instance.LoadTipsByStr(res.msg)
                            return
                        }

                        UIManager.instance.LoadTipsByStr("购买成功，获得：" + money[index] + "会员卡")
                        DD.instance.addDiamond(money[index])
                    })
                }
            })
        }

    }
}
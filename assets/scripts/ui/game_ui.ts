
import AudioManager from "../manager/audio_manager"
import DD from "../manager/dynamic_data_manager"
import EffectManager from "../manager/effect_manager"
import GameManager from "../manager/game_manager"
import JsonManager from "../manager/json_manager"
import PoolManager from "../manager/pool_manager"
import ResourceManager from "../manager/resources_manager"
import UIManager from "../manager/ui_manager"
import GameUIView from "../ui_view/panel/game_ui_view"
import { Config } from "../utils/config"
import { Emitter } from "../utils/emmiter"
import { GameStatue, ResType } from "../utils/enum"
import { MessageType } from "../utils/message"
import { Utils } from "../utils/utils"
import FailUI from "./fail_ui"
import HomeUI from "./home_ui"
import RewardUI from "./reward_ui"
import SettingUI from "./setting_ui"
import ShopUI from "./shop_ui"

//主体游戏UI
const { ccclass, property } = cc._decorator

@ccclass
export default class GameUI extends cc.Component {
    static instance: GameUI = null
    view: GameUIView = new GameUIView()
    @property(cc.EffectAsset)
    dissolveEffect: cc.EffectAsset = null

    @property(cc.Material)
    greyEffect: cc.Material = null
    @property(cc.Material)
    normalEffect: cc.Material = null

    //curChoose: ItemCell = null
    maxIndex: number = 1

    onLoad() {
        this.view.initView(this.node)
        GameUI.instance = this
        this.view.content.active = false
        this._bindEvent()
        this.view.nodeEnd.active = true
        cc.tween(this.view.sprRole.node)
            .repeatForever(
                cc.tween()
                    .to(1, { scaleX: -1.05, scaleY: 0.95 })
                    .to(1, { scaleX: -0.95, scaleY: 1.05 })
            ).start()
    }
    private _bindEvent() {
        this.view.btnBack.node.on("click", this.onClickBack, this)
        this.view.btnBuyMoney.node.on("click", () => {
            AudioManager.instance.playAudio("click")
            UIManager.instance.openUI(ShopUI, { name: Config.uiName.shopUI, param: [1] })
        }, this)
        this.view.btnBuyDiamond.node.on("click", () => {

            AudioManager.instance.playAudio("click")
            UIManager.instance.openUI(ShopUI, { name: Config.uiName.shopUI, param: [2] })
        }, this)
        setInterval(() => {
        }, 1000);
    }
    initGame() {
        this.maxIndex = 0
        this.view.content.active = true
        PoolManager.instance.removeObjByContainer(this.view.nodeCostomer)
        AudioManager.instance.playBGM("day")
        setTimeout(() => {
            this.refreshUI()
        
            this.view.nodeEnd.active = false
        });
    }
   
    refreshUI() {
        if (this.view.content.active) {
            this.view.nodeUnlimite.active = GameManager.instance.unlimite
            if (GameManager.instance.unlimite) {
                this.view.nodeOrderContainer.active = false
                this.view.labUnlimiteTime.string = GameManager.instance.unlimiteTimer.toFixed(0) + "秒"
                let num = 0
              
               
            } else {
                this.view.nodeOrderContainer.active = true
                PoolManager.instance.removeObjByContainer(this.view.nodeOrderContainer)
             
            }

        }

    }
   



    getNewMaterial() {
        let material = cc.Material.create(this.dissolveEffect, 0)
        material.define('USE_TINT', true)
        material.define('USE_TEXTURE', true)
        return material
    }
    hideUI() {

        this.view.content.active = false
    }
    setTop(cellNode: cc.Node) {
        cellNode.zIndex = ++this.maxIndex
    }

   
    update(dt) {
        if (!this.view.content.active) return

        //判断是否要获得种子
        if (GameManager.instance.unlimite && GameManager.instance.unlimiteTimer) {
            if (Math.ceil(GameManager.instance.unlimiteTimer) - Math.ceil(GameManager.instance.unlimiteTimer - dt) > 0) {
                this.refreshUI()
            }
            if (GameManager.instance.unlimiteTimer > 0) {
                GameManager.instance.unlimiteTimer -= dt
                if (GameManager.instance.unlimiteTimer <= 0) {
                 //   GameManager.instance.onUnlimiteDone()
                }
            }


        }
    }
    onClickBack() {
        AudioManager.instance.playAudio("click")
        if (GameManager.instance.unlimite) {
            GameManager.instance.unlimiteTimer = -1
            //GameManager.instance.onUnlimiteDone()
        } else {
            this.hideUI()
            HomeUI.instance.showUI()
        }
    }

    // onChooseCell(item: ItemCell) {
    //     if (this.curChoose) {
    //         //判断是否是交换
    //         this.unChooseCell(this.curChoose)
    //     }
    //     item.isChoose = true
    //     item.playAnima()
    //     this.curChoose = item
    //     this.view.nodeCellContainer.children.forEach((node) => {
    //         let scp = node.getComponent(ItemCell)
    //         if (scp != item && scp.cell < GameManager.instance.maxLevel && scp.id == item.id && scp.cell == item.cell) {
    //             scp.setPercheck(true)
    //         } else {
    //             scp.setPercheck(false)
    //         }
    //     })
    //     //  let info = JsonManager.instance.getDataByName("cell")[item.cell]
    //     this.setDetailHeader(true, item)
    // }
    // unChooseCell(item) {
    //     item.stopAnima()
    //     item.isChoose = false
    //     this.curChoose = null
    //     this.view.nodeCellContainer.children.forEach((node) => {
    //         let scp = node.getComponent(ItemCell)
    //         if (scp != item && scp.cell < GameManager.instance.maxLevel && scp.id == item.id && scp.cell == item.cell) {
    //             scp.setPercheck(false)
    //         }
    //     })
    //     this.setDetailHeader(false)
    // }
    // onSwitch(one: ItemCell, two: ItemCell) {
    //     if (!two.canMove()) {
    //         return
    //     }
    //     let ahead = [one.x, one.y]
    //     let farmMap = DD.instance.playerData.farmMap
    //     farmMap[one.x][one.y] = [two.id, two.cell]
    //     farmMap[two.x][two.y] = [one.id, one.cell]
    //     one.x = two.x
    //     one.y = two.y
    //     // one.id = two.id
    //     // one.cell = two.cell
    //     two.x = ahead[0]
    //     two.y = ahead[1]
    //     // two.id = ahead[2]
    //     // two.cell = ahead[3]

    //     this.setDetailHeader(true, one)
    // }
    // getCellByXy(x: number, y: number) {
    //     //按位置去找
    //     let node = this.view.nodeCellContainer.children.find(n => {
    //         let scp = n.getComponent(ItemCell)
    //         if (!scp.des) {
    //             let nxy = scp.getXY()
    //             if (nxy[0] == x && nxy[1] == y) {
    //                 return true
    //             }
    //         }
    //         return false
    //     })
    //     if (node) {
    //         return node.getComponent(ItemCell)
    //     } else {
    //         return null
    //     }
    //     // if (!node) return null
    //     // let scp = node.getComponent(ItemCell)
    //     // if (scp.des || scp.isMove) return null
    //     // // cc.log(scp.getXY(), x, y)
    //     // return scp
    // }
    // createNewCell(x, y, cell?) {
    //     let node = PoolManager.instance.createObjectByName("itemCell", this.view.nodeCellContainer)
    //     node.getComponent(ItemCell).initByNew(x, y, cell)
    //     return node.getComponent(ItemCell)
    // }
   
}
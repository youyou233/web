
import FlyItem from "../item/fly_item"
import ItemEnemy from "../item/item_enemy"
import ItemPlant from "../item/item_plant"
import ItemPlayer from "../item/item_player"
import TrackFlyItem from "../item/track_fly_item"
import AudioManager from "../manager/audio_manager"
import GameManager from "../manager/game_manager"
import PoolManager from "../manager/pool_manager"
import UIManager from "../manager/ui_manager"
import GameUIView from "../ui_view/panel/game_ui_view"
import { Config } from "../utils/config"
import { GameStatue } from "../utils/enum"
import HomeUI from "./home_ui"
import RewardUI from "./reward_ui"
import ShopUI from "./shop_ui"

//主体游戏UI
const { ccclass, property } = cc._decorator

@ccclass
export default class GameUI extends cc.Component {

    static instance: GameUI = null
    view:  GameUIView = new GameUIView()
    @property(cc.EffectAsset)
    dissolveEffect: cc.EffectAsset = null

    @property(cc.Material)
    greyEffect: cc.Material = null
    @property(cc.Material)
    normalEffect: cc.Material = null

    maxIndex: number = 1
    lv: number = 1

    player: ItemPlayer = null

    size: number = 4

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
        // this.view.btnBuyMoney.node.on("click", () => {
        //     AudioManager.instance.playAudio("click")
        //     UIManager.instance.openUI(ShopUI, { name: Config.uiName.shopUI, param: [1] })
        // }, this)
        // this.view.btnBuyDiamond.node.on("click", () => {

        //     AudioManager.instance.playAudio("click")
        //     UIManager.instance.openUI(ShopUI, { name: Config.uiName.shopUI, param: [2] })
        // }, this)
        this.view.nodeTouchArea.on(cc.Node.EventType.TOUCH_START, this._startTouch, this)
        this.view.nodeTouchArea.on(cc.Node.EventType.TOUCH_MOVE, this._moveTouch, this)
        this.view.nodeTouchArea.on(cc.Node.EventType.TOUCH_END, this._endTouch, this)
        this.view.nodeTouchArea.on(cc.Node.EventType.TOUCH_CANCEL, this._endTouch, this)
    }
    initGame() {
        this.maxIndex = 0
        this.view.content.active = true
        PoolManager.instance.removeObjByContainer(this.view.nodeContainer)
        AudioManager.instance.playBGM("day")
        setTimeout(() => {
            this.refreshUI()

            this.view.nodeEnd.active = false
        });
    }
    //根据植物数量出现植物
    refreshUI() {
        if (this.view.content.active) {
            this.view.nodeUnlimite.active = GameManager.instance.unlimite
           

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

        if (GameManager.instance.state == GameStatue.start) {
          
            this.player.onUpdate(dt)
            this.view.nodeContainer.children.forEach((node) => {
                if (node.name == "flyItem") {
                    node.getComponent(FlyItem).onUpdate(dt)
                }
                if (node.name == "trackFlyItem") {
                    node.getComponent(TrackFlyItem).onUpdate(dt)
                }
                if (node.name == "itemEnemy") {
                    node.getComponent(ItemEnemy).onUpdate(dt)
                }
                if(node.name=="itemPlant"){
                    node.getComponent(ItemPlant).onUpdate(dt)
                }
            })
        }
    }


    createMonster() {
       
    }

    onGameWin() {
        if (GameManager.instance.unlimite) {
            this.refreshHeader()
            AudioManager.instance.playAudio("levelup")
        } else {
            GameManager.instance.state = GameStatue.pause
            UIManager.instance.openUI(RewardUI, { name: Config.uiName.rewardUI })
        }

    }
    refreshHeader() {

    }
    onGameFail() {
        GameManager.instance.state = GameStatue.pause

        this.hideUI()
        HomeUI.instance.showUI()
        UIManager.instance.LoadTipsByStr("作战失败")

    }
    onClickBack() {
        GameManager.instance.state = GameStatue.pause
        UIManager.instance.LoadMessageBox("确认退出", "确认退出会立即结算奖励并且返回到主界面。", (isOK) => {
            if (isOK) {
                UIManager.instance.openUI(RewardUI, { name: Config.uiName.rewardUI })
            } else {
                GameManager.instance.state = GameStatue.start
            }
        })
    }



    //触摸
    _startTouch(event) {
        AudioManager.instance.playAudio("click_area")
        this.player.targetPos = this.node.parent.convertToNodeSpaceAR(event.getLocation())
    }
    _moveTouch(event) {
        this.player.targetPos = this.node.parent.convertToNodeSpaceAR(event.getLocation())
    }
    _endTouch(event) {
         AudioManager.instance.playAudio("click_pause")
        this.player.targetPos = null
    }


  
    checkWin() {

    }


    getXyByPos(pos: cc.Vec2) {

    }
    getCellByXy(x: number, y: number) {
        //按位置去找
        let node = this.view.nodeCellContainer.children.find(n => {
            // let scp = n.getComponent(ItemCell)
            // if (!scp.des) {
            //     let nxy = scp.getXY()
            //     if (nxy[0] == x && nxy[1] == y) {
            //         return true
            //     }
            // }
            return false
        })
        if (node) {
            //  return node.getComponent(ItemCell)
        } else {
            return null
        }

    }
    //随机获得一个地点
    getRandomFreePos() {

    }
}

import FlyItem from "../item/fly_item"
import ItemEnemy from "../item/item_enemy"
import ItemHelper from "../item/item_helper"
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
import { Utils } from "../utils/utils"
import HomeUI from "./home_ui"
import RewardUI from "./reward_ui"
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

    maxIndex: number = 1
    lv: number = 1

    @property(ItemPlayer)
    player: ItemPlayer = null

    size: number = 4
    helperNum: any

    totalMonster: number = 0
    refreshMonster: number = 0
    monsterTimer: number = 0

    onLoad() {
        this.view.initView(this.node)
        GameUI.instance = this
        this.view.content.active = false
        this._bindEvent()
        this.view.nodeEnd.active = true
        // cc.tween(this.view.sprRole.node)
        //     .repeatForever(
        //         cc.tween()
        //             .to(1, { scaleX: -1.05, scaleY: 0.95 })
        //             .to(1, { scaleX: -0.95, scaleY: 1.05 })
        //     ).start()
    }
    private _bindEvent() {
        this.view.btnBack.node.on("click", this.onClickBack, this)
        this.view.nodeTouchArea.on(cc.Node.EventType.TOUCH_START, this._startTouch, this)
        this.view.nodeTouchArea.on(cc.Node.EventType.TOUCH_MOVE, this._moveTouch, this)
        this.view.nodeTouchArea.on(cc.Node.EventType.TOUCH_END, this._endTouch, this)
        this.view.nodeTouchArea.on(cc.Node.EventType.TOUCH_CANCEL, this._endTouch, this)
    }
    initGame(lv: number) {
        this.player.node.active = true
        setTimeout(() => {
            this.player.init()
        });
        this.totalMonster = GameManager.instance.getAllEnemyNum(this.lv)
        this.refreshMonster = 0
        this.monsterTimer = 0
        PoolManager.instance.removeObjByContainer(this.view.nodeContainer)
        this.view.content.active = true
        this.refreshHeader()
      
        if (GameManager.instance.unlimite) {

            AudioManager.instance.playBGM("day8")
          
        } else {
            AudioManager.instance.playBGM("day4")
          
        }
    }
    //根据植物数量出现植物
    refreshUI() {

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
                if (node.name == "itemPlant") {
                    node.getComponent(ItemPlant).onUpdate(dt)
                }
                if(node.name=="itemHelper"){
                    node.getComponent(ItemHelper).onUpdate(dt)
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
        if (!GameManager.instance.unlimite) {

        } else {
            return false
        }
    }


    getXyByPos(pos: cc.Vec2) {
        let cellSize = 640 / this.size
        let x = Math.floor((pos.x + 320) / cellSize)
        let y = Math.floor((pos.y + 320) / cellSize)
        if (x < 0) x = 0
        if (x > this.size - 1) x = this.size - 1
        if (y < 0) y = 0
        if (y > this.size - 1) y = this.size - 1
        return [x, y]

    }
    getCellByXy(x: number, y: number) {
        //按位置去找
        let node = this.view.nodeContainer.children.find(n => {
            if (n.name == "itemEnemy") {
                let scp = n.getComponent(ItemEnemy)
                if (scp) {
                    if (scp.x == x && scp.y == y) {
                        return true
                    }
                }
            } else if (n.name == "itemPlant") {
                let scp = n.getComponent(ItemPlant)
                if (scp) {
                    if (scp.x == x && scp.y == y) {
                        return true
                    }
                }
            }

            return false
        })
        if (node) {
            if (node.name == "itemEnemy") {
                return node.getComponent(ItemEnemy)
            } else if (node.name == "itemPlant") {
                return node.getComponent(ItemPlant)
            }
        } else {
            return null
        }

    }
    //随机获得一个地点
    getRandomFreePos() {
        let x = Utils.getRandomNumber(this.size - 1)
        let y = Utils.getRandomNumber(this.size - 1)
        let cell = this.getCellByXy(x, y)
        if (cell) {
            return this.getRandomFreePos()
        } else {
            return [x, y]
        }

    }
}
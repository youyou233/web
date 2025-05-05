
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
    checkWin() {
        throw new Error("Method not implemented.")
    }


    static instance: GameUI = null
    view: any// GameUIView = new GameUIView()
    @property(cc.EffectAsset)
    dissolveEffect: cc.EffectAsset = null

    @property(cc.Material)
    greyEffect: cc.Material = null
    @property(cc.Material)
    normalEffect: cc.Material = null

    //curChoose: ItemCell = null
    maxIndex: number = 1
    lv: number = 1

    player: any = null

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
        this.view.nodeTouchArea.on(cc.Node.EventType.TOUCH_START, this._startTouch, this)
        this.view.nodeTouchArea.on(cc.Node.EventType.TOUCH_MOVE, this._moveTouch, this)
        this.view.nodeTouchArea.on(cc.Node.EventType.TOUCH_END, this._endTouch, this)
        this.view.nodeTouchArea.on(cc.Node.EventType.TOUCH_CANCEL, this._endTouch, this)
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




    //随机生成敌人
    genMonster() {

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

    getAreaPlantByXy(x: number, y: number) {

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

    //触摸
    _startTouch(event) {
        // AudioManager.instance.playAudio("click_area")
        this.player.targetPos = this.node.parent.convertToNodeSpaceAR(event.getLocation())
    }
    _moveTouch(event) {
        this.player.targetPos = this.node.parent.convertToNodeSpaceAR(event.getLocation())
    }
    _endTouch(event) {
        //  AudioManager.instance.playAudio("click_pause")
        this.player.targetPos = null
    }


    refreshHpBar(progress) {
        this.view.nodeHpMask.width = 200 * progress
    }
}
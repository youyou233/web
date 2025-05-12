
import FlyItem from "../item/fly_item"
import ItemEnemy from "../item/item_enemy"
import ItemHelper from "../item/item_helper"
import ItemPlant from "../item/item_plant"
import ItemPlayer from "../item/item_player"
import TrackFlyItem from "../item/track_fly_item"
import AudioManager from "../manager/audio_manager"
import DD from "../manager/dynamic_data_manager"
import GameManager from "../manager/game_manager"
import PoolManager from "../manager/pool_manager"
import ResourceManager from "../manager/resources_manager"
import UIManager from "../manager/ui_manager"
import GameUIView from "../ui_view/panel/game_ui_view"
import { Config } from "../utils/config"
import { GameStatue, ResType } from "../utils/enum"
import { Utils } from "../utils/utils"
import FailUI from "./fail_ui"
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
    helperNum: number = 1

    totalMonster: number = 0
    refreshMonster: number = 0
    monsterTimer: number = 0

    onLoad() {
        this.view.initView(this.node)
        GameUI.instance = this
        this.view.content.active = false
        this._bindEvent()
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
        this.lv = lv
        this.totalMonster = GameManager.instance.getAllEnemyNum(this.lv)
        this.refreshMonster = 0
        this.helperNum = 0
        this.monsterTimer = 0
        PoolManager.instance.removeObjByContainer(this.view.nodeContainer)
        this.view.content.active = true
        this.refreshHeader()
        if (GameManager.instance.unlimite) {
            ResourceManager.instance.getBackGround((Utils.getRandomNumber(4) + 1 + "")).then((res) => {
                this.view.sprBackground.spriteFrame = res
            })
        } else {
            ResourceManager.instance.getBackGround((lv % 5 + 1 + "")).then((res) => {
                this.view.sprBackground.spriteFrame = res
            })
        }

        AudioManager.instance.playBGM("day")
        if (GameManager.instance.unlimite) {
            this.view.labTip.string = "拖动小人左右移动，驱赶土拔鼠。"
            this.size = 5
            this.view.labLevel.string = "挑战\n模式"
        } else {
            this.size = Math.ceil(Math.sqrt(lv + 4))
            if (this.size > 9) this.size = 9
            this.view.labTip.string = "拖动小人左右移动，为所有植物浇水即可通关。"
            this.view.labLevel.string = "第" + lv + "关"
        }
        this.player.node.getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSprite(ResType.main, `农民-${DD.instance.playerData.roleEquip}`)
        this.createPanel()
        this.createMonster()
        this.createHelper()
        setTimeout(() => {
            this.player.init()
        });
    }
    createPanel() {
        PoolManager.instance.removeObjByContainer(this.view.nodeTileContainer)
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let node = PoolManager.instance.createObjectByName("itemCell", this.view.nodeTileContainer)
                node.width = 600 / this.size
                node.height = 600 / this.size
                node.getChildByName("spr").scale = 3 / this.size
                node.getComponent(cc.Sprite).setMaterial(0, this.getNewMaterial())
            }
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
                if (node.name == "itemHelper") {
                    node.getComponent(ItemHelper).onUpdate(dt)
                }
            })
            this.monsterTimer += dt
            if (GameManager.instance.unlimite) {
                if (this.monsterTimer > 3) {
                    this.monsterTimer = 0
                    this.createMonster()
                }
            } else if (this.monsterTimer > 3 || GameManager.instance.score == this.refreshMonster) {
                this.monsterTimer = 0

                if (this.refreshMonster >= this.totalMonster) {
                    this.checkWin()
                } else {
                    this.createMonster()
                }
            }
        }
    }


    createMonster() {
        //判断是否失败
        if (GameManager.instance.unlimite) {
            let freePos = this.getRandomFreePos()
            if (!freePos) {
                this.onGameWin()
                return
            }
            let enemy = PoolManager.instance.createObjectByName("itemEnemy", this.view.nodeContainer)
            enemy.getComponent(ItemEnemy).init(1, freePos[0], freePos[1])
        } else {
            let freePos = this.getRandomFreePos()
            if (!freePos) {
                this.onGameFail()
                return
            }
            let plant = PoolManager.instance.createObjectByName("itemPlant", this.view.nodeContainer)
            plant.getComponent(ItemPlant).init(1, freePos[0], freePos[1])
        }
        this.refreshMonster++
    }

    onGameWin() {
        AudioManager.instance.playAudio("levelup")
        GameManager.instance.state = GameStatue.pause
        if (GameManager.instance.unlimite) {
            UIManager.instance.openUI(RewardUI, { name: Config.uiName.rewardUI })
        } else {
            GameManager.instance.state = GameStatue.pause
            UIManager.instance.openUI(RewardUI, { name: Config.uiName.rewardUI, param: [this.lv] })
            //  UIManager.instance.LoadTipsByStr("作战成功")
        }

    }
    refreshHeader() {
        if (!GameManager.instance.unlimite) {
            this.view.labScoreTitle.string = "目标作物"
            this.view.labScore.string = GameManager.instance.score + "/" + this.totalMonster

        } else {
            this.view.labScoreTitle.string = "驱赶数量"
            this.view.labScore.string = GameManager.instance.score + ""
        }
    }
    onGameFail() {
        GameManager.instance.state = GameStatue.pause

        this.hideUI()
        UIManager.instance.openUI(FailUI, { name: Config.uiName.failUI })
    }
    onClickBack() {
        GameManager.instance.state = GameStatue.pause
        if (GameManager.instance.unlimite) {
            UIManager.instance.LoadMessageBox("确认退出", "确认退出会立即结算奖励并且返回到主界面。", (isOK) => {
                if (isOK) {
                    UIManager.instance.openUI(RewardUI, { name: Config.uiName.rewardUI })
                } else {
                    GameManager.instance.state = GameStatue.start
                }
            })
        } else {
            UIManager.instance.LoadMessageBox("确认退出", "如果退出将回到主界面。", (isOK) => {
                if (isOK) {
                    this.hideUI()
                    HomeUI.instance.showUI()
                } else {
                    GameManager.instance.state = GameStatue.start
                }
            })
        }
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
        this.refreshHeader()
        if (!GameManager.instance.unlimite) {
            if (GameManager.instance.score >= this.totalMonster) {
                this.onGameWin()
            }
        } else {
            return false
        }
    }

    getPosByXy(x: number, y: number) {
        let cellSize = 600 / this.size
        let posX = x * cellSize - 300 + cellSize / 2
        let posY = y * cellSize - 300 + cellSize / 2 + 92.087
        return cc.v2(posX, posY)
    }

    getXyByPos(pos: cc.Vec2) {
        let cellSize = 600 / this.size
        let x = Math.floor((pos.x + 300) / cellSize)
        let y = Math.floor((pos.y + 300) / cellSize)
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
        let freeListPos = []
        //如果没有随机地点了呢
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let cell = this.getCellByXy(i, j)
                if (!cell) {
                    freeListPos.push([i, j])
                }
            }
        }
        if (freeListPos.length == 0) {
            return null
        } else {
            return Utils.getArrRandomItem(freeListPos)
        }
    }
    createHelper() {
        let helperId = DD.instance.playerData.flyEquip
        let helperNum = DD.instance.getSpecialNum(DD.instance.playerData.flyMap[DD.instance.playerData.flyEquip])
        for (let i = 0; i < helperNum; i++) {
            let helpyer = PoolManager.instance.createObjectByName("itemHelper", this.view.nodeContainer)
            helpyer.getComponent(ItemHelper).init(helperId, this.helperNum)
            this.helperNum++
        }

    }
}
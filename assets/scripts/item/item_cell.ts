
// import { CellInfo } from "../interface/cell_info"
// import AudioManager from "../manager/audio_manager"
// import DD from "../manager/dynamic_data_manager"
// import EffectManager from "../manager/effect_manager"
// import GameManager from "../manager/game_manager"
// import JsonManager from "../manager/json_manager"
// import PoolManager from "../manager/pool_manager"
// import ResourceManager from "../manager/resources_manager"
// import UIManager from "../manager/ui_manager"
// import GameUI from "../ui/game_ui"
// import { Emitter } from "../utils/emmiter"
// import { DirType, ResType } from "../utils/enum"
// import { MessageType } from "../utils/message"
// import { Utils } from "../utils/utils"

// const { ccclass, property } = cc._decorator
// //如何计算位置
// @ccclass
// export default class ItemCell extends cc.Component {
//     @property(cc.Node)
//     percheckNode: cc.Node = null
//     @property(cc.Node)
//     beDesNode: cc.Node = null
//     @property(cc.Sprite)
//     sprIcon: cc.Sprite = null
//     @property(cc.Sprite)
//     sprShadow: cc.Sprite = null
//     @property(cc.Node)
//     nodeCheck: cc.Node = null
//     des: boolean = false
//     id: number = 1//类型
//     cell: number = 1//等级
//     x: number = 0
//     y: number = 0
//     isChoose: boolean = false
//     isTouch: boolean = false
//     get info() {
//         return JsonManager.instance.getDataByName("cell")[this.id] as CellInfo
//     }
//     protected onLoad(): void {
//         // this.node.on("click", this.onClick, this)


//         this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
//         this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
//         this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
//         this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
//         Emitter.register(MessageType.onRoundBy, this.onRoundBy, this)
//         cc.tween(this.nodeCheck).repeatForever(
//             cc.tween()
//                 .to(0.5, { scale: 1.12 }, cc.easeInOut(2))
//                 .to(0.5, { scale: 1.05 }, cc.easeInOut(2)))
//             .start()
//         cc.tween(this.sprShadow.node).repeatForever(
//             cc.tween()
//                 .to(0.5, { scale: 1.2 }, cc.easeInOut(2))
//                 .to(0.5, { scale: 1 }, cc.easeInOut(2)))
//             .start()
//     }

//     init(x: number, y: number, id?, cell: number = 1) {
//         this.setDefault()
//         this.node.setPosition(GameManager.instance.getPostionByXY(x, y))
//         if (id) {
//             this.id = id
//         } else {
//             this.id = Utils.getRandomNumber(6) + 1
//         }
//         this.cell = cell || 1
//         this.x = x
//         this.y = y
//         this.node.opacity = 255
//         this.refresh()
//         // this.setZindex()
//     }
//     //生成全新的方块
//     initByNew(x: number, y: number, id?, cell: number = GameManager.instance.seedBasicLv) {
//         this.x = x
//         this.y = y
//         this.setDefault()
//         this.cell = cell || 1
//         if (id) {
//             this.id = id
//         } else {
//             this.id = GameManager.instance.getRandomCell()
//         }
//         this.node.setPosition(Utils.getNodeUsePos(GameUI.instance.view.btnSeed.node).add(cc.v2(0, 150)))
//         this.refresh()
//         let time = GameManager.instance.cellSizeY - 1 - y//掉落需要时间
//         // this.isMove = true
//         // this.moveTarget = [x, y]
//         this.node.opacity = 0

      
//         // if (all == 1) pauseTime *= 0.5

//         cc.tween(this.node)
//             .to(0.5, { opacity: 255 })
//             .start()
//     }
//     resetColor(color: number) {
//         this.id = color
//         this.refresh()
//     }
//     setDefault() {
//         this.stopAnima()
//         this.beDesNode.stopAllActions()
//         this.beDesNode.opacity = 0
//         this.node.stopAllActions()
//         this.sprIcon.node.stopAllActions()
//         this.des = false
//         this.sprIcon.node.scale = 0.97
//         this.sprIcon.node.opacity = 255
//         this.nodeCheck.active = false
//         this.node.zIndex = 0
//         this.percheckNode.active = false
//         this.setPercheck(false)
//         this.isChoose = false
//         this.isTouch = false
//     }
//     refresh() {
//         //  let info = JsonManager.instance.getDataByName("role")[this.id] as RoleInfo
//         //设置图片 
//         if (this.isChoose) {

//         } else {
//             this.setStaticSp()
//         }
//     }


//     getXY() {
//         // let pos = this.node.getPosition()
//         // let x = Math.floor((pos.x + GameManager.instance.cellSizeX / 2 * GameManager.instance.cellWidth) / GameManager.instance.cellWidth)
//         // let y = Math.floor((pos.y + GameManager.instance.cellHeight * GameManager.instance.cellSizeY / 2) / GameManager.instance.cellHeight)
//         return [this.x, this.y]
//     }
//     //判断是否是金币
//     //当自身被消除的时候向周围四个发送这个函数

//     checkIsReward() {
//         return [103, 104, 105].includes(this.cell)
//     }
//     //是否能被能力消除
//     canBeDes() {
//         if (this.cell == 101 || this.cell == 102) {
//             return false
//         }
//         if (this.des) {
//             return false
//         }
//         // let pos = this.getXY()
//         // let env = BattleManager.instance.envMap[pos[0]][pos[1]]
//         // if (env == 201) {
//         //     return false
//         // }
//         return true
//     }
//     getEffectPos() {
//         return Utils.getNodeUsePos(this.node)
//     }
//     //当被消除的时候
//     //是否触发周围的消除
//     onBeDes(score?: any, checkAround: boolean = true) {
//         if (this.des) {
//             return
//         }
//         if (this.isChoose)
//             GameUI.instance.unChooseCell(this)
//         this.des = true
//         //消除时的效果
//         let selfXy = this.getXY()
//         let checkDrop = false
//         this.nodeCheck.active = false
//         cc.tween(this.sprIcon.node).to(0.3, { scale: 0.1, opacity: 100 }, cc.easeIn(2)).call(() => {
//             PoolManager.instance.removeObject(this.node)
//         }).start()
//         EffectManager.instance.createEffect("shine0012", Utils.getNodeUsePos(this.node))
//         // if (checkAround) {
//         //     let around = [GameUI.instance.getCellByXy(selfXy[0], selfXy[1] + 1), GameUI.instance.getCellByXy(selfXy[0], selfXy[1] - 1),
//         //     GameUI.instance.getCellByXy(selfXy[0] - 1, selfXy[1]), GameUI.instance.getCellByXy(selfXy[0] + 1, selfXy[1])]
//         //     around.forEach((item) => {
//         //         if (item && item.checkIsReward() && item.canBeDes()) {
//         //             item.onBeDes(null, false)
//         //             checkDrop = true
//         //         }
//         //     })
//         // }
//         // if (checkAround) {
//         //     DisManager.instance.checkDisByDebouce()
//         // }
//         // if (score) {
//         //     GameManager.instance.addScore(5, Utils.getNodeUsePos(this.node))
//         // }
//     }

//     playAnima() {
//         //判断是否有动画
//         this.sprIcon.node.setPosition(0, 0)
//         this.nodeCheck.active = true
//         // let clips = this.anima.getClips()
//         // let name = "gem_" + this.cell
//         // if (clips.some(clip => { return clip.name == name })) {
//         //     this.anima.play(name)
//         //     this.nodeCheck.getComponent(cc.Animation).play(name)
//         //     // this.anima.resume()
//         //     return
//         // }
//         let cellInfo = JsonManager.instance.getDataByName("cell")[this.cell] as CellInfo
//         if (!cellInfo) debugger


//         // this.anima.addClip(clip)
//         // this.anima.play(name)

//         // this.nodeCheck.getComponent(cc.Animation).addClip(clip)
//         // this.nodeCheck.getComponent(cc.Animation).play(name)
//     }
//     stopAnima() {
//         this.nodeCheck.active = false
//     }
//     setStaticSp() {
//         let cellInfo = JsonManager.instance.getDataByName("cell")[this.cell] as CellInfo
//         let name = "cell-" + (this.id * 10 + this.cell - 1)
//         this.sprIcon.node.setPosition(0, 0)

//         this.sprIcon.spriteFrame = ResourceManager.instance.getSprite(ResType.main, name)

//     }
//     onTouchStart(event: cc.Event.EventTouch) {
//         if (!this.canMove()) return
//         EffectManager.instance.createEffect("click", Utils.getNodeUsePos(this.node))
//         this.isTouch = true
//         AudioManager.instance.playAudio("click")
//         GameUI.instance.setTop(this.node)
//         // cc.log(this.node.getPosition(), this.getXY())
//         if (this.isChoose) {
//             //  GameUI.instance.unChooseCell(this)
//         } else {
//             GameUI.instance.onChooseCell(this)
//         }
//     }
//     canMove() {
//         if (this.des) {
//             return false
//         }
//         let pos = this.getXY()
//         return true
//     }
//     //判断范围
//     onTouchMove(event: cc.Event.EventTouch) {
//         if (this.isTouch) {
//             let endPos = event.touch.getLocation()
//             let localLocation = this.node.convertToNodeSpaceAR(endPos);
//             //判断是否switch
//             this.node.x += event.getDeltaX() / 0.66
//             this.node.y += event.getDeltaY() / 0.66
//         }
//     }
//     onTouchEnd(event: cc.Event.EventTouch) {
//         AudioManager.instance.playAudio("click")
//         if (this.isChoose) {
//             let endPos = event.touch.getLocation()
//             let localLocation = this.node.convertToNodeSpaceAR(endPos);
//             let targetFarm = GameManager.instance.getXyByPostion(this.node.getPosition())
//             //判断是否switch
//             if (targetFarm[0] >= 0 && targetFarm[0] < GameManager.instance.cellSizeX && targetFarm[1] >= 0 && targetFarm[1] < GameManager.instance.cellSizeY) {
//                 let cell = GameUI.instance.getCellByXy(targetFarm[0], targetFarm[1])
//                 if (cell) {
//                     //判断是否可以合成
//                     if (this.cell < GameManager.instance.maxLevel && cell.cell < GameManager.instance.maxLevel && cell.id == this.id && cell.cell == this.cell && cell != this) {

//                         GameUI.instance.onMerge(this, cell)
//                     } else {
//                         GameUI.instance.onSwitch(this, cell)
//                     }
//                 } else {
//                     GameUI.instance.putCellOnFarm(this, targetFarm)
//                 }
//             }
//         }
//         this.isTouch = false
//     }
//     onClick() {

//     }
//     isNear(other: ItemCell) {
//         let otherXy = other.getXY()
//         let selfXy = this.getXY()
//         if (!other.des && !this.des) {
//             if ((otherXy[0] == selfXy[0] && Math.abs(otherXy[1] - selfXy[1]) == 1) || (otherXy[1] == selfXy[1] && Math.abs(otherXy[0] - selfXy[0]) == 1)) {
//                 return true
//             }
//         }
//         return false
//     }



//     //棋盘越大速度越快
//     getSpd() {
//         return 1
//     }



//     //道具放上去之后的影响范围
//     setPercheck(ac: boolean) {
//         this.percheckNode.active = ac
//     }

//     changeTo(id: number) {
//         this.cell = id
//         this.refresh()
//     }
//     onRoundBy() {
//         let pos = this.getXY()
//         //   let player = GameManager.instance.getRoleById(this.id)

//     }
//     protected update(dt: number): void {
//         if (this.isTouch) return
//         if (this.des) return
//         let targetPos = GameManager.instance.getPostionByXY(this.x, this.y)
//         let div = targetPos.sub(this.node.getPosition())
//         if (div.mag() > 1) {
//             if (div.mag() < 20) {
//                 div = div.normalize().mul(20)
//             }
//             this.node.x += div.x / 20
//             this.node.y += div.y / 20
//         } else {
//             this.node.setPosition(targetPos)
//         }
//     }

//     showBeDesByPowerBg() {
//         //0 被消除 
//         this.beDesNode.scale = 0.5
//         cc.tween(this.beDesNode).to(0.1, { scale: 1, opacity: 255 }, cc.easeIn(2))
//             .to(0.2, { opacity: 0 })
//             .start()
//     }
// }
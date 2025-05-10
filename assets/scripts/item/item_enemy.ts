import AudioManager from "../manager/audio_manager"
import EffectManager from "../manager/effect_manager"
import GameManager from "../manager/game_manager"
import PoolManager from "../manager/pool_manager"
import ResourceManager from "../manager/resources_manager"
import GameUI from "../ui/game_ui"
import { GroupType, ResType } from "../utils/enum"
import { Utils } from "../utils/utils"
import FlyItem from "./fly_item"
import ItemPlayer from "./item_player"



const { ccclass, property } = cc._decorator
@ccclass
export default class ItemEnemy extends cc.Component {
    @property(cc.Label)
    hpLabel: cc.Label = null
    @property(cc.Sprite)
    hpBar: cc.Sprite = null
    hp: number = 0
    spd: number = 200
    cold: number = 0
    targetPos: cc.Vec2 = null
    material: cc.Material = null
    normalMate: cc.Material = cc.Material.createWithBuiltin("2d-sprite", 0)
    id: number = 0
    x: number = 0
    y: number = 0
    maxHp: number = 0
    protected onLoad(): void {
        this.material = GameUI.instance.getNewMaterial()
        this.node.getComponent(cc.Sprite).setMaterial(0, this.normalMate)
        this.normalMate.define("USE_TEXTURE", true, 0);
        this.material.setProperty("fade_pct", 0);
    }
    init(id: number, x, y) {
        this.node.stopAllActions()
        this.deadAnima = null
        this.hp = Math.pow(GameUI.instance.refreshMonster, 1.75) * 5 + 5
        this.maxHp = Math.pow(GameUI.instance.refreshMonster, 1.75) * 5 + 5
        this.id = id
        this.node.getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSprite(ResType.main, "ai-anima-monster (" + (Utils.getRandomNumber(3) + 1) + ")")
        this.node.opacity = 255
        this.node.getComponent(cc.Sprite).setMaterial(0, this.normalMate)
        this.normalMate.define("USE_TEXTURE", true, 0);
        this.material.setProperty("fade_pct", 0);
        this.node.setPosition(GameUI.instance.getPosByXy(x, y))
        this.x = x
        this.y = y
        this.hpLabel.string = Math.ceil(this.hp) + ""
        this.node.scale = 1 / GameUI.instance.size * 3
        this.hpBar.fillRange = 1
    }
    isDead() {
        return this.hp <= 0
    }
    beAtk(dmg, pos?) {
        if (this.isDead()) return
        if (!pos) pos = Utils.getNodeUsePos(this.node)
        EffectManager.instance.createEffect("click", pos)
        this.hp -= dmg
        EffectManager.instance.createLabel(dmg.toFixed(0) + "", pos)
        if (this.hp <= 0) {
            this.hp = 0
            this.showDeadAnima()
            return
        } else {
            this.showBeAtkAction()
        }

        this.hpLabel.string = Math.ceil(this.hp) + ""
        this.hpBar.fillRange = this.hp / this.maxHp
        //PoolManager.instance.removeObject(this.node)
    }
    onUpdate(dt) {
        if (this.isDead()) return
        let playerPos = GameUI.instance.player.node.getPosition()
        let arr = this.node.getPosition().sub(playerPos)
        // switch (this.type) {
        //     case EnemyType.none:
        //         this.node.y -= 1 * dt * this.spd
        //         break
        //     case EnemyType.track:
        //         if (arr.mag() > 10) {
        //             arr = arr.normalize()
        //             this.node.y -= arr.y * dt * this.spd
        //             this.node.x -= arr.x * dt * this.spd
        //             this.node.angle = Utils.getAngle(arr.neg()) - 90
        //         }
        //         break
        //     case EnemyType.bullet:
        //         if (this.node.y > this.targetPos.y) {
        //             this.node.y -= 0.5 * dt * this.spd
        //         }
        //         if (Math.abs(arr.x) > 10) {
        //             this.node.x -= (arr.x > 0 ? 1 : -1) * dt * this.spd

        //         }
        //         break
        //     case EnemyType.pos:
        //         let arrTarget = this.node.getPosition().sub(this.targetPos)
        //         if (arrTarget.mag() > 10) {
        //             arrTarget = arrTarget.normalize()
        //             this.node.y -= arrTarget.y * dt * this.spd
        //             this.node.x -= arrTarget.x * dt * this.spd
        //         }
        //         this.node.angle = Utils.getAngle(arr.neg()) - 90
        //         //要进入屏幕后暂停
        //         break
        // }
        this.cold -= dt
        if (this.cold <= 0) {
            this.cold = GameManager.instance.getEnemyCold(GameUI.instance.lv)
            this.onAtk()
        }
        if (this.node.y < -1500) {
            this.showDeadAnima()
        }
    }
    onAtk() {
        if (this.isDead()) return
        // switch (this.type) {
        //     case EnemyType.none:
        //     case EnemyType.bullet:
        //         {
        //             let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
        //             node.getComponent(FlyItem).init(GroupType.enemy, GameManager.instance.getEnemyAtk(GameUI.instance.lv), {
        //                 spd: cc.v2(0, -1), startPos: this.node.getPosition(),
        //                 bullet: this.isBoss ? 3 : 2
        //             })
        //             break
        //         }
        //     case EnemyType.pos:
        //         {
        //             let playerPos = GameUI.instance.player.node.getPosition()
        //             let arr = playerPos.sub(this.node.getPosition())
        //             let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
        //             node.getComponent(FlyItem).init(GroupType.enemy, GameManager.instance.getEnemyAtk(GameUI.instance.lv), {
        //                 spd: arr.normalize(), startPos: this.node.getPosition(),
        //                 bullet: this.isBoss ? 3 : 2
        //             })

        //             break
        //         }
        // }
    }
    showBeAtkAction() {
        if (this.isDead()) return
        this.node.getComponent(cc.Sprite).setMaterial(0, this.material)
        // if (detal > 5) detal = 5
        //判断是左边还是右边


        this.material.setProperty("addColor", [0.6, 0.6, 0.6, 1]);
        cc.tween(this.node).delay(0.1)
            .call(() => {
                //  this.setMonsterArr()
                this.node.getComponent(cc.Sprite).setMaterial(0, this.normalMate)
            })
            .start()
    }
    deadAnima: cc.Tween = null
    showDeadAnima() {
        if (this.deadAnima) return
        AudioManager.instance.playAudio("airplaneExplosion")
        this.node.stopAllActions()
        // this._view.nodeShadow.stopAllActions()
        let data = { fade_pac: 0 }
        this.node.getComponent(cc.Sprite).setMaterial(0, this.material)
        this.material.setProperty("addColor", [0, 0, 0, 1]);
        this.deadAnima = cc.tween(data)
            .to(0.5, { fade_pac: 1 }, {
                onUpdate: () => {
                    this.material.setProperty("fade_pct", data.fade_pac);
                    this.node.opacity = 255 - 255 * data.fade_pac
                }
            }).call(() => {
                this.deadAnima = null
                PoolManager.instance.removeObject(this.node)
                GameManager.instance.score++
                GameUI.instance.checkWin()
            }).start()
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (this.isDead()) return



        //  cc.log('onCollisionEnter')
    }

    // isInScreen(node) {
    //     let worldPosition = node.convertToWorldSpaceAR(cc.v2(0, 0));

    //     // 获取屏幕大小
    //     let screenWidth = cc.view.getVisibleSize().width;
    //     let screenHeight = cc.view.getVisibleSize().height;

    //     // 获取摄像机节点（通常是 Canvas 下的主摄像机）
    //     let camera = cc.Camera.findCamera(node);

    //     // 将世界坐标转换为屏幕坐标
    //     let screenPosition = camera.getWorldToScreenPoint(worldPosition);

    //     // 判断是否在屏幕内
    //     let isInScreen = screenPosition.x >= 0 && screenPosition.x <= screenWidth &&
    //         screenPosition.y >= 0 && screenPosition.y <= screenHeight;

    //     if (isInScreen) {
    //      //   console.log("物体在屏幕内");
    //         return true
    //     }
    //     return false
    // }
}
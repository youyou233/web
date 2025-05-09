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
export default class ItemPlant extends cc.Component {
    @property(cc.Label)
    hpLabel: cc.Label = null
    @property(cc.Sprite)
    hpBar: cc.Sprite = null
    hp: number = 0
    material: cc.Material = null
    normalMate: cc.Material = cc.Material.createWithBuiltin("2d-sprite", 0)
    id: number = 0
    x: number = 0
    y: number = 0
    protected onLoad(): void {
        this.material = GameUI.instance.getNewMaterial()
        this.node.getComponent(cc.Sprite).setMaterial(0, this.normalMate)
        this.normalMate.define("USE_TEXTURE", true, 0);
        this.material.setProperty("fade_pct", 0);
    }
    init(id: number, x, y) {
        this.node.stopAllActions()
        this.deadAnima = null
        this.hp = GameManager.instance.getEnemyMaxHp(GameUI.instance.lv)
        this.id = id
        // this.node.getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSprite(ResType.main, "enemy-enemy (" + this.id + ")")
        this.node.opacity = 255
        this.node.getComponent(cc.Sprite).setMaterial(0, this.normalMate)
        this.normalMate.define("USE_TEXTURE", true, 0);
        this.material.setProperty("fade_pct", 0);
        this.node.setPosition(GameUI.instance.getPosByXy(x, y))
        this.x = x
        this.y = y
        this.hpLabel.string = this.hp.toFixed(0)
        this.node.scale = 1 / GameUI.instance.size * 3
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

        this.hpBar.fillRange = this.hp / GameManager.instance.getEnemyMaxHp(GameUI.instance.lv)
        this.hpBar.node.active = true
        this.hpLabel.string = this.hp.toFixed(0)
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

        if (this.node.y < -1500) {
            this.showDeadAnima()
        }
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


}
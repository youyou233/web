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

export enum EnemyType {
    none,
    track,
    bullet,
    pos//定点
}

const { ccclass, property } = cc._decorator
@ccclass
export default class ItemEnemy extends cc.Component {
    @property(cc.Sprite)
    hpBar: cc.Sprite = null
    hp: number = 0
    spd: number = 200
    isBoss: boolean = false
    type: EnemyType = EnemyType.pos
    cold: number = 0
    targetPos: cc.Vec2 = null
    material: cc.Material = null
    normalMate: cc.Material = cc.Material.createWithBuiltin("2d-sprite", 0)
    id: number = 0
    protected onLoad(): void {
        this.material = GameUI.instance.getNewMaterial()
        this.node.getComponent(cc.Sprite).setMaterial(0, this.normalMate)
        this.normalMate.define("USE_TEXTURE", true, 0);
        this.material.setProperty("fade_pct", 0);
    }
    init(isBoss: boolean = false, id: number) {
        let EnemyTypes = [0, 3, 3, 3, 1,
            3, 1, 1, 3, 3,
            2, 2, 2, 0, 3,
            0, 2, 2, 0, 3,
            2, 3]
        this.node.stopAllActions()
        this.deadAnima = null
        this.node.setPosition(cc.v2(Utils.getRandomNumber(640) - 320, 1000))
        this.node.group = "enemy"
        this.node.angle = -180
        this.targetPos = cc.v2(Utils.getRandomNumber(640) - 320, Utils.getRandomNumber(500))
        this.hp = GameManager.instance.getEnemyMaxHp(GameUI.instance.lv)
        this.hpBar.node.active = false
        this.node.scale = isBoss ? 1 : 0.5
        this.id = id
        this.isBoss = isBoss
        this.node.getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSprite(ResType.main, "enemy-enemy (" + this.id + ")")
        this.type = EnemyTypes[id - 1]
        this.node.opacity = 255
        this.cold = GameManager.instance.getEnemyCold(GameUI.instance.lv)
        this.node.getComponent(cc.Sprite).setMaterial(0, this.normalMate)
        this.normalMate.define("USE_TEXTURE", true, 0);
        this.material.setProperty("fade_pct", 0);
        if (this.isBoss) {
            AudioManager.instance.playAudio("noise (" + (Utils.getRandomNumber(4) + 1) + ")")
        }
    }
    isDead() {
        return this.hp <= 0
    }
    beAtk(dmg, pos?) {
        if (this.isDead()) return
        if (!this.isInScreen(this.node)) return
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
        this.hpBar.fillRange = this.hp / GameManager.instance.getEnemyMaxHp(GameUI.instance.lv) / 2
        this.hpBar.node.active = true
        //PoolManager.instance.removeObject(this.node)
    }
    onUpdate(dt) {
        if (this.isDead()) return
        let playerPos = GameUI.instance.player.node.getPosition()
        let arr = this.node.getPosition().sub(playerPos)
        switch (this.type) {
            case EnemyType.none:
                this.node.y -= 1 * dt * this.spd
                break
            case EnemyType.track:
                if (arr.mag() > 10) {
                    arr = arr.normalize()
                    this.node.y -= arr.y * dt * this.spd
                    this.node.x -= arr.x * dt * this.spd
                    this.node.angle = Utils.getAngle(arr.neg()) - 90
                }
                break
            case EnemyType.bullet:
                if (this.node.y > this.targetPos.y) {
                    this.node.y -= 0.5 * dt * this.spd
                }
                if (Math.abs(arr.x) > 10) {
                    this.node.x -= (arr.x > 0 ? 1 : -1) * dt * this.spd

                }
                break
            case EnemyType.pos:
                let arrTarget = this.node.getPosition().sub(this.targetPos)
                if (arrTarget.mag() > 10) {
                    arrTarget = arrTarget.normalize()
                    this.node.y -= arrTarget.y * dt * this.spd
                    this.node.x -= arrTarget.x * dt * this.spd
                }
                this.node.angle = Utils.getAngle(arr.neg()) - 90
                //要进入屏幕后暂停
                break
        }
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
        switch (this.type) {
            case EnemyType.none:
            case EnemyType.bullet:
                {
                    let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(FlyItem).init(GroupType.enemy, GameManager.instance.getEnemyAtk(GameUI.instance.lv), {
                        spd: cc.v2(0, -1), startPos: this.node.getPosition(),
                        bullet: this.isBoss ? 3 : 2
                    })
                    break
                }
            case EnemyType.pos:
                {
                    let playerPos = GameUI.instance.player.node.getPosition()
                    let arr = playerPos.sub(this.node.getPosition())
                    let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(FlyItem).init(GroupType.enemy, GameManager.instance.getEnemyAtk(GameUI.instance.lv), {
                        spd: arr.normalize(), startPos: this.node.getPosition(),
                        bullet: this.isBoss ? 3 : 2
                    })

                    break
                }
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
                GameUI.instance.checkWin()
            }).start()
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (this.isDead()) return
        if (other.node.name == 'itemPlayer') {
            //判断是否可以反射
            let role = other.node.getComponent(ItemPlayer)
            if (role.isDead()) return
            role.beAtk(GameManager.instance.getEnemyAtk(GameUI.instance.lv), Utils.getNodeUsePos(this.node))
            EffectManager.instance.createEffect("Earth0001", Utils.getNodeUsePos(this.node))
            this.hp = 0
            this.showDeadAnima()
        }


        //  cc.log('onCollisionEnter')
    }

    isInScreen(node) {
        let worldPosition = node.convertToWorldSpaceAR(cc.v2(0, 0));

        // 获取屏幕大小
        let screenWidth = cc.view.getVisibleSize().width;
        let screenHeight = cc.view.getVisibleSize().height;

        // 获取摄像机节点（通常是 Canvas 下的主摄像机）
        let camera = cc.Camera.findCamera(node);

        // 将世界坐标转换为屏幕坐标
        let screenPosition = camera.getWorldToScreenPoint(worldPosition);

        // 判断是否在屏幕内
        let isInScreen = screenPosition.x >= 0 && screenPosition.x <= screenWidth &&
            screenPosition.y >= 0 && screenPosition.y <= screenHeight;

        if (isInScreen) {
         //   console.log("物体在屏幕内");
            return true
        }
        return false
    }
}
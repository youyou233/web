
import EffectManager from "../manager/effect_manager"
import GameManager from "../manager/game_manager"
import JsonManager from "../manager/json_manager"
import PoolManager from "../manager/pool_manager"
import ResourceManager from "../manager/resources_manager"
import GameUI from "../ui/game_ui"
import { GameStatue, GroupType, ResType } from "../utils/enum"
import { Utils } from "../utils/utils"
import { FlyData } from "./fly_item"
import ItemEnemy from "./item_enemy"
import ItemPlant from "./item_plant"

const { ccclass, property } = cc._decorator

@ccclass
export default class TrackFlyItem extends cc.Component {
    @property(cc.Sprite)
    spr: cc.Sprite = null
    @property(cc.ParticleSystem)
    partical: cc.ParticleSystem = null
    target: cc.Node = null
    // arr: cc.Vec2 = null
    // curCross: number = 0
    trackSpd: number = 5
    isRemove: boolean = false
    dmg: number = 0
    protected onLoad(): void {
        this.isRemove = true
    }
    init(dmg: number, flyData: FlyData) {
        clearTimeout(this.removeTimer)
        this.dmg = dmg
        this.leftArr = flyData.spd
        this.dmg = dmg
        this.isRemove = false
        this.node.scale = 1
        this.node.opacity = 255
        this.node.setPosition(flyData.startPos)
        this.node.group = 'player'
        this.spr.spriteFrame = ResourceManager.instance.getSprite(ResType.main, "bullet-bullet_6")
        this.partical.resetSystem()
    }
    initPartical() {
        //初始化
        this.leftArr = Utils.getRandomNumber(1) == 1 ? cc.v2(1, 0) : cc.v2(-1, 0)
        this.trackSpd = Utils.getRandomNumber(3) + 3
    }
    loadPartical(name?) {
        ResourceManager.instance.getPartical(name).then((res: cc.ParticleAsset) => {
            this.partical.file = res
            this.partical.custom = false
            this.partical.resetSystem()
        })
    }
    //跟踪一般都是粒子
    leftArr: cc.Vec2 = cc.v2(0)
    onUpdate(dt: number): void {
        if (this.isRemove) return
        if (GameManager.instance.unlimite) {
            if (!this.target || this.target.getComponent(ItemEnemy).isDead()) {
                let arr = Utils.getNormalDivByAngel(this.node.angle)
                let div = arr.normalize().add(this.leftArr.normalize().mul(150))
                this.node.x -= (div.x) * dt * 5 //* this.data.spd.x
                this.node.y -= (div.y) * dt * 5 //* this.data.spd.y
                if (arr.x != 0 && arr.y != 0) {
                    this.leftArr = this.leftArr.normalize().mul(this.trackSpd).add(arr.normalize())
                }
                this.findTarget()
            }
        } else {
            if (!this.target || this.target.getComponent(ItemPlant).isDead()) {
                let arr = Utils.getNormalDivByAngel(this.node.angle)
                let div = arr.normalize().add(this.leftArr.normalize().mul(150))
                this.node.x -= (div.x) * dt * 5 //* this.data.spd.x
                this.node.y -= (div.y) * dt * 5 //* this.data.spd.y
                if (arr.x != 0 && arr.y != 0) {
                    this.leftArr = this.leftArr.normalize().mul(this.trackSpd).add(arr.normalize())
                }
                this.findTarget()
            }
        }

        if (this.target) {
            let arr = this.node.getPosition().sub(this.target.getPosition())
            let div = arr.normalize().add(this.leftArr.normalize().mul(150))
            this.node.x -= (div.x) * dt * 5 //* this.data.spd.x
            this.node.y -= (div.y) * dt * 5 //* this.data.spd.y
            this.node.angle = Utils.getAngle(div) + 90
            if (arr.x != 0 && arr.y != 0) {
                this.leftArr = this.leftArr.normalize().mul(this.trackSpd).add(arr.normalize())
            }
        } else {
            this.onRemove()
        }
        if (Math.abs(this.node.y) > 1500 || Math.abs(this.node.x) > 1000) {
            PoolManager.instance.removeObject(this.node)
        }

        //跟随角色
    }

    findTarget() {

        let ss = GameUI.instance.view.nodeContainer.children.filter((node) => {
            if (GameManager.instance.unlimite) {
                if (node.name == "itemEnemy" && !node.getComponent(ItemEnemy).isDead()) {
                    return true
                }
            } else {
                if (node.name == "itemPlant" && !node.getComponent(ItemPlant).isDead()) {
                    return true
                }
            }

            return false
        })
        if (ss.length > 0) {
            this.target = ss[0]
            return
        }
        this.target = null
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (this.isRemove) return
        if (other.node.name == 'itemEnemy') {
            let role = other.node.getComponent(ItemEnemy)
            if (role.isDead()) {
                this.onRemove()
                return
            }
            role.beAtk(this.dmg, this.node.getPosition())
            this.onRemove()
        }else if (other.node.name == 'itemPlant') {
            let role = other.node.getComponent(ItemPlant)
            if (role.isDead()) {
                this.onRemove()
                return
            }
            role.beAtk(this.dmg, this.node.getPosition())
            this.onRemove()
        }
    }
    checkRemove() {
        this.onRemove()
    }

    removeTimer: any = null
    onRemove() {
        this.isRemove = true
        clearTimeout(this.removeTimer)
        // this.subPar.stopSystem()
        this.partical.stopSystem()
        this.spr.spriteFrame = null
        //展示击中特效
        this.removeTimer = setTimeout(() => {
            PoolManager.instance.removeObject(this.node)
        }, 300);
    }

}

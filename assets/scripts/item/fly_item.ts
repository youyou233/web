
import GameManager from "../manager/game_manager"
import JsonManager from "../manager/json_manager"
import PoolManager from "../manager/pool_manager"
import ResourceManager from "../manager/resources_manager"
import { GameStatue, GroupType, ResType } from "../utils/enum"
import { Utils } from "../utils/utils"
import ItemEnemy from "./item_enemy"
import ItemPlayer from "./item_player"

const { ccclass, property } = cc._decorator
export interface FlyData {
    spd: cc.Vec2
    startPos: cc.Vec2
    bullet: number
    through?: number
}
@ccclass
export default class FlyItem extends cc.Component {
    @property(cc.Sprite)
    spr: cc.Sprite = null
    @property(cc.ParticleSystem)
    partical: cc.ParticleSystem = null
    // arr: cc.Vec2 = null
    data: FlyData = null
    group: GroupType = GroupType.player
    isRemove: boolean = false
    dmg: number = 0
    through: number = 0
    flySpd: number = 500
    protected onLoad(): void {
        this.isRemove = true
    }
    init(from: GroupType, dmg: number, flyData: FlyData) {
        clearTimeout(this.removeTimer)
        this.dmg = dmg
        this.group = from
        this.data = flyData
        this.through = this.data.through || 1
        this.node.scale = 1
        this.node.opacity = 255
        this.node.setPosition(flyData.startPos)
        this.initFlyItem()
        switch (from) {
            case GroupType.enemy:
                this.node.group = 'enemy'
                break
            case GroupType.player:
                this.node.group = 'player'
                break
        }
        this.isRemove = false
    }
    initFlyItem() {
        if (this.group != GroupType.enemy) {
            this.partical.resetSystem()
        } else {
            this.partical.stopSystem()
        }
        this.spr.spriteFrame = ResourceManager.instance.getSprite(ResType.main, "bullet-bullet_" + this.data.bullet)
    }

    onUpdate(dt) {
        if (this.isRemove) return
        this.node.x += this.data.spd.x * dt * this.flySpd
        this.node.y += this.data.spd.y * dt * this.flySpd
        this.node.angle = Utils.getAngle(this.data.spd) - 90
        if (Math.abs(this.node.y) > 1500 || Math.abs(this.node.x) > 1000) {
            PoolManager.instance.removeObject(this.node)
        }


    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (this.isRemove) return
        if (other.node.name == 'itemPlayer' && this.group == GroupType.enemy) {
            //判断是否可以反射
            let role = other.node.getComponent(ItemPlayer)
            if (role.isDead()) return
            role.beAtk(this.dmg, this.node.getPosition())
            this.checkThrough()
        } else if (other.node.name == 'itemEnemy'&& this.group == GroupType.player) {
            let role = other.node.getComponent(ItemEnemy)
            if (role.isDead()) return
            role.beAtk(this.dmg, this.node.getPosition())
            this.checkThrough()
        }

    }

    //溅射
    checkThrough() {
        this.through--
        if (this.through <= 0) {
            this.onRemove()
        }
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
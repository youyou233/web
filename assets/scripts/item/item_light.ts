import JsonManager from "../manager/json_manager";
import PoolManager from "../manager/pool_manager";
import { GroupType } from "../utils/enum";
import { Utils } from "../utils/utils";
import ItemEnemy from "./item_enemy";
import ItemPlant from "./item_plant";

const { ccclass, property } = cc._decorator

@ccclass
export default class ItemLight extends cc.Component {
    damage: number = 0
    init(damage: number, start: cc.Vec2, arr: cc.Vec2): void {
        this.damage = damage
        this.node.setPosition(start)
        this.node.angle = this.node.angle = Utils.getAngle(arr) - 90
        setTimeout(() => {
            PoolManager.instance.removeObject(this.node)
        }, 100);
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.name == 'itemEnemy') {
            let role = other.node.getComponent(ItemEnemy)
            if (role.isDead()) return
            role.beAtk(this.damage)

        }else if (other.node.name == 'itemPlant') {
            let role = other.node.getComponent(ItemPlant)
            if (role.isDead()) return
            role.beAtk(this.damage)
        }
    }
}
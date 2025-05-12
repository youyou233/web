import AudioManager from "../manager/audio_manager"
import DD from "../manager/dynamic_data_manager"
import EffectManager from "../manager/effect_manager"
import GameManager from "../manager/game_manager"
import PoolManager from "../manager/pool_manager"
import ResourceManager from "../manager/resources_manager"
import GameUI from "../ui/game_ui"
import ItemPlayerView from "../ui_view/item/item_player_view"
import { GroupType, ResType } from "../utils/enum"
import { Utils } from "../utils/utils"
import FlyItem from "./fly_item"
import ItemLight from "./item_light"
import TrackFlyItem from "./track_fly_item"

const { ccclass, property } = cc._decorator
@ccclass
export default class ItemPlayer extends cc.Component {
    targetPos: cc.Vec2 = null
    moveSpd: number = 500
    atkCold: number = 0
    onLoad() {

    }
    init() {
        this.targetPos = null
        this.node.setPosition(0, -561.45)
        this.node.opacity = 255
    }

    onUpdate(dt) {
        if (this.targetPos) {
            let distance = this.targetPos.sub(this.node.getPosition())
            if (distance.mag() > 10) {
                let dir = distance.normalize()
                if (dir) {
                    let angle = Math.atan2(dir.y, dir.x);
                    angle = angle / Math.PI * 180;
                    angle = 90 - angle;

                    // this.node.angle = - angle;

                    let speed_x = this.moveSpd * dir.x * dt;
                    let speed_y = this.moveSpd * dir.y * dt;
                    // if (this.isInsideView(this.node.x + speed_x, this.node.y + speed_y)) {
                    this.node.x += speed_x;
                    this.node.y += speed_y;
                    if (this.node.x > 300) this.node.x = 300
                    if (this.node.x < -300) this.node.x = -300
                    if (this.node.y > -536) this.node.y = -536
                    if (this.node.y < -630) this.node.y = -630
                }
            }

        }
        if (!this.isDead()) {
            this.atkCold -= dt
            if (this.atkCold <= 0) {
                this.atkCold = GameManager.instance.getRoleCold()
                this.onAtk()
            }

        }
    }
    onAtk() {
        let lv = DD.instance.playerData.roleMap[DD.instance.playerData.roleEquip]
        let maxNum = DD.instance.getSpecialNum(lv)
        switch (DD.instance.playerData.roleEquip) {
            case 1:
                AudioManager.instance.playAudio("pistol1")
                for (let i = 0; i < 1; i++) {
                    let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getRoleAtk(), {
                        spd: cc.v2(0, 1),
                        startPos: GameManager.instance.getFlyStartPos(this.node.getPosition().add(cc.v2(0, 120)), i, 1),
                        bullet: 1,
                        through: maxNum
                    })
                }
                break
            case 2:
                AudioManager.instance.playAudio("AKM")
                for (let i = 0; i < maxNum + 1; i++) {
                    let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getRoleAtk(), {
                        spd: GameManager.instance.getFlyArr(cc.v2(0, 1), i, maxNum + 1),
                        startPos: GameManager.instance.getFlyStartPos(this.node.getPosition().add(cc.v2(0, 120)), i, maxNum + 1),
                        bullet: 4,
                    })
                }
                break
            case 3:
                AudioManager.instance.playAudio("Explosion")
                for (let i = 0; i < Math.ceil(maxNum / 2); i++) {
                    let node = PoolManager.instance.createObjectByName("trackFlyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(TrackFlyItem).init(GameManager.instance.getRoleAtk(), {
                        spd: GameManager.instance.getFlyArr(cc.v2(0, 1), i, Math.ceil(maxNum / 2)),
                        startPos: GameManager.instance.getFlyStartPos(this.node.getPosition().add(cc.v2(0, 120)), i, Math.ceil(maxNum / 2)),
                        bullet: 6
                    })
                }
                break
            case 4:
                AudioManager.instance.playAudio("laser3")
                for (let i = 0; i < maxNum; i++) {
                    let node = PoolManager.instance.createObjectByName("lightItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(ItemLight).init(GameManager.instance.getRoleAtk(), this.node.getPosition().add(cc.v2(0, 120)), GameManager.instance.getFlyArr(cc.v2(0, 1), i, maxNum))
                }
                break
        }


    }

    isDead() {
        return false
    }


}
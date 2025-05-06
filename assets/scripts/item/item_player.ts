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
    _view: ItemPlayerView = new ItemPlayerView()
    targetPos: cc.Vec2 = null
    moveSpd: number = 500
    atkCold: number = 0
    flyCold: number = 0
    material: cc.Material = null
    normalMate: cc.Material = cc.Material.createWithBuiltin("2d-sprite", 0)
    onLoad() {
        this._view.initView(this.node)
        this.normalMate.define("USE_TEXTURE", true, 0);
        // this.joyStick = GameUI.instance.view.itemJoystick.getComponent(ItemJoyStick)
        this.material = GameUI.instance.getNewMaterial()

    }
    init() {
        this.targetPos = null
        this.node.setPosition(0, -300)

        this.node.getComponent(cc.Sprite).setMaterial(0, this.normalMate)
        this.deadAnima = null
        this.normalMate.define("USE_TEXTURE", true, 0);
        this.material.setProperty("fade_pct", 0);
        GameUI.instance.refreshHpBar(1)
        this.node.opacity = 255
        this.node.getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSprite(ResType.main, `player-role (${DD.instance.playerData.roleEquip})`)
        this._view.nodeWeapon1.getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSprite(ResType.main, `weapon-weapon (${DD.instance.playerData.flyEquip})`)
        this._view.nodeWeapon2.getComponent(cc.Sprite).spriteFrame = this._view.nodeWeapon1.getComponent(cc.Sprite).spriteFrame
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
                }
            }

        }
        if (!this.isDead()) {
            this.atkCold -= dt
            if (this.atkCold <= 0) {
                this.atkCold = GameManager.instance.getRoleCold()
                this.onAtk()
            }
            this.flyCold -= dt
            if (this.flyCold <= 0) {
                this.flyCold = GameManager.instance.getFlyCold()
                this.onFlyAtk()
            }
        }
    }
    onAtk() {
        let maxNum = GameManager.instance.getRoleAtkNum()
        switch (DD.instance.playerData.roleEquip) {
            case 1:
                AudioManager.instance.playAudio("pistol1")
                for (let i = 0; i <maxNum; i++) {
                    let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getRoleAtk(), {
                        spd: cc.v2(0, 1),
                        startPos: GameManager.instance.getFlyStartPos(this.node.getPosition().add(cc.v2(25, 65)), i,maxNum),
                        bullet: 1,
                        through:maxNum
                    })
                }
                break
            case 2:
                AudioManager.instance.playAudio("AKM")
                for (let i = 0; i < maxNum; i++) {
                    let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getRoleAtk(), {
                        spd: GameManager.instance.getFlyArr(cc.v2(0, 1), i, maxNum),
                        startPos: GameManager.instance.getFlyStartPos(this.node.getPosition().add(cc.v2(25, 65)), i, maxNum),
                        bullet: 4,
                    })
                }
                break
            case 3:
                AudioManager.instance.playAudio("Explosion")
                for (let i = 0; i <  Math.ceil(maxNum / 2); i++) {
                    let node = PoolManager.instance.createObjectByName("trackFlyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(TrackFlyItem).init(GameManager.instance.getRoleAtk(), {
                        spd: GameManager.instance.getFlyArr(cc.v2(0, 1), i,  Math.ceil(maxNum / 2)),
                        startPos: GameManager.instance.getFlyStartPos(this.node.getPosition().add(cc.v2(25, 65)), i,  Math.ceil(maxNum / 2)),
                        bullet: 6
                    })
                }
                break
            case 4:
                AudioManager.instance.playAudio("laser3")
                for (let i = 0; i < maxNum; i++) {
                    let node = PoolManager.instance.createObjectByName("lightItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(ItemLight).init(GameManager.instance.getRoleAtk(), this.node.getPosition().add(cc.v2(25, 65)), GameManager.instance.getFlyArr(cc.v2(0, 1), i, maxNum))
                }
                break
        }


    }
    onFlyAtk() {
        let maxNum = GameManager.instance.getFlyAtkNum()
        switch (DD.instance.playerData.flyEquip) {
            case 1:
                AudioManager.instance.playAudio("pistol1")
                for (let i = 0; i < maxNum; i++) {
                    let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getFlyAtk(), {
                        spd: cc.v2(-0.342, 0.939),
                        startPos: GameManager.instance.getFlyStartPos(Utils.getNodeUsePos(this._view.nodeWeapon1), i, maxNum),
                        bullet: 1,
                        through: maxNum
                    })

                    let node2 = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
                    node2.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getFlyAtk(), {
                        spd: cc.v2(0.342, 0.939),
                        startPos: GameManager.instance.getFlyStartPos(Utils.getNodeUsePos(this._view.nodeWeapon2), i, maxNum),
                        bullet: 1,
                        through: maxNum
                    })
                }
                break
            case 2:
                AudioManager.instance.playAudio("AKM")
                for (let i = 0; i < maxNum; i++) {
                    let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getFlyAtk(), {
                        spd: GameManager.instance.getFlyArr(cc.v2(-0.342, 0.939), i, maxNum),
                        startPos: GameManager.instance.getFlyStartPos(Utils.getNodeUsePos(this._view.nodeWeapon1), i, maxNum),
                        bullet: 4
                    })

                    let node2 = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
                    node2.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getFlyAtk(), {
                        spd: GameManager.instance.getFlyArr(cc.v2(0.342, 0.939), i, maxNum),
                        startPos: GameManager.instance.getFlyStartPos(Utils.getNodeUsePos(this._view.nodeWeapon2), i, maxNum),
                        bullet: 4
                    })
                }
                break
            case 3:
                AudioManager.instance.playAudio("Explosion")
                for (let i = 0; i <  Math.ceil(maxNum / 2); i++) {
                    let node = PoolManager.instance.createObjectByName("trackFlyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(TrackFlyItem).init(GameManager.instance.getFlyAtk(), {
                        spd: cc.v2(0, 1),
                        startPos: Utils.getNodeUsePos(this._view.nodeWeapon1),
                        bullet: 6
                    })

                    let node2 = PoolManager.instance.createObjectByName("trackFlyItem", GameUI.instance.view.nodeContainer)
                    node2.getComponent(TrackFlyItem).init(GameManager.instance.getFlyAtk(), {
                        spd: cc.v2(0, 1),
                        startPos: Utils.getNodeUsePos(this._view.nodeWeapon2),
                        bullet: 6
                    })
                }
                break
            case 4:
                AudioManager.instance.playAudio("laser3")
                for (let i = 0; i < maxNum; i++) {
                    let node = PoolManager.instance.createObjectByName("lightItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(ItemLight).init(GameManager.instance.getFlyAtk(), Utils.getNodeUsePos(this._view.nodeWeapon1), GameManager.instance.getFlyArr(cc.v2(-0.342, 0.939), i, maxNum))

                    let node2 = PoolManager.instance.createObjectByName("lightItem", GameUI.instance.view.nodeContainer)
                    node2.getComponent(ItemLight).init(GameManager.instance.getFlyAtk(), Utils.getNodeUsePos(this._view.nodeWeapon2), GameManager.instance.getFlyArr(cc.v2(0.342, 0.939), i, maxNum))
                }
                break
        }


    }
   
    isDead() {
        return false
    }

    showBeAtkAction() {
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
        this.node.stopAllActions()
        let data = { fade_pac: 0 }
        this.node.getComponent(cc.Sprite).setMaterial(0, this.material)
        this.material.setProperty("addColor", [0, 0, 0, 1]);
        AudioManager.instance.playAudio("Impact_2")
        this.deadAnima = cc.tween(data)
            .to(0.5, { fade_pac: 1 }, {
                onUpdate: () => {
                    this.material.setProperty("fade_pct", data.fade_pac);
                    this.node.opacity = 255 - 255 * data.fade_pac
                }
            }).call(() => {
                GameUI.instance.onGameFail()
                //PoolManager.instance.removeObject(this.node)
            }).start()
    }
}
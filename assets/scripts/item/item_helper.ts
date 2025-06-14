import AudioManager from "../manager/audio_manager"
import DD from "../manager/dynamic_data_manager";
import GameManager from "../manager/game_manager";
import PoolManager from "../manager/pool_manager";
import ResourceManager from "../manager/resources_manager";
import GameUI from "../ui/game_ui";
import { GameStatue, GroupType, ResType } from "../utils/enum";
import { Utils } from "../utils/utils";
import FlyItem from "./fly_item";
import ItemLight from "./item_light";
import TrackFlyItem from "./track_fly_item";

const { ccclass, property } = cc._decorator

@ccclass
export default class ItemHelper extends cc.Component {


    @property(cc.Prefab)
    bulletPrefabs: cc.Prefab[] = [null, null, null, null];

    @property(cc.Float)
    followSpeed: number = 5.0;

    @property(cc.Float)
    fireRate: number = 1.0;

    flyCold: number = 0

    // Index of this helper in the array of active helpers
    private _helperIndex: number = 0;

    // Radius for circular arrangement
    @property(cc.Float)
    circleRadius: number = 120;

    private _itemID: number = 0;
    private _currentBulletType: number = 0;
    private _canFire: boolean = true;
    private _fireInterval: number = null;

    protected onLoad(): void {
        // Initialize component
    }

    init(id: number, index: number) {
        this._itemID = id;

        // Set default bullet type based on id if needed
        this._currentBulletType = id % 4;

        // Register this helper in the static collection
        this._helperIndex = index
        this.node.getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSprite(ResType.main, `道具-prop_${id}`)
    }





    stopFiring(): void {
        if (this._fireInterval) {
            clearInterval(this._fireInterval);
            this._fireInterval = null;
        }
    }

    fireBullet(): void {
        if (!this._canFire) return;
        let lv = DD.instance.playerData.roleMap[DD.instance.playerData.roleEquip]
        let maxNum = DD.instance.getSpecialNum(lv)
        switch (DD.instance.playerData.flyEquip) {
            case 1:
                AudioManager.instance.playAudio("pistol1")
                for (let i = 0; i < 1; i++) {
                    let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getFlyAtk(), {
                        spd: cc.v2(0, 1),
                        startPos: GameManager.instance.getFlyStartPos(Utils.getNodeUsePos(this.node), i, maxNum),
                        bullet: 1,
                        through: maxNum
                    })
                }
                break
            case 2:
                AudioManager.instance.playAudio("AKM")
                for (let i = 0; i < 2; i++) {
                    let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getFlyAtk(), {
                        spd: GameManager.instance.getFlyArr(cc.v2(0, 1), i, 2),
                        startPos: GameManager.instance.getFlyStartPos(Utils.getNodeUsePos(this.node), i, 2),
                        bullet: 4
                    })
                }
                break
            case 3:
                AudioManager.instance.playAudio("Explosion")
                for (let i = 0; i < 1; i++) {
                    let node = PoolManager.instance.createObjectByName("trackFlyItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(TrackFlyItem).init(GameManager.instance.getFlyAtk(), {
                        spd: cc.v2(0, 1),
                        startPos: Utils.getNodeUsePos(this.node),
                        bullet: 6
                    })
                }
                break
            case 4:
                AudioManager.instance.playAudio("laser3")
                for (let i = 0; i < 1; i++) {
                    let node = PoolManager.instance.createObjectByName("lightItem", GameUI.instance.view.nodeContainer)
                    node.getComponent(ItemLight).init(GameManager.instance.getFlyAtk(), Utils.getNodeUsePos(this.node), GameManager.instance.getFlyArr(cc.v2(0, 1), i, maxNum))


                }
                break
        }




    }


    onClick() {
        // Cycle through bullet types when clicked
        this._currentBulletType = (this._currentBulletType + 1) % this.bulletPrefabs.length;
    }

    onUpdate(dt: number): void {
        // Follow target with circular arrangement
        if (GameManager.instance.state == GameStatue.start) {
            const targetPosition = GameUI.instance.player.node.getPosition().add(cc.v2(0, 50)); // Adjust the offset as needed
            const currentPosition = this.node.position;

            // Calculate the total number of active helpers
            const totalHelpers = GameUI.instance.helperNum

            // Calculate the angle for this helper (equally distributed around the circle)
            // Start from the top (90 degrees) and go clockwise
            const angleInRadians = (Math.PI * 2 * this._helperIndex / totalHelpers);

            // Calculate the desired position in a circle around the target
            const desiredPosition = cc.v3(
                targetPosition.x + Math.cos(angleInRadians) * this.circleRadius,
                targetPosition.y + Math.sin(angleInRadians) * this.circleRadius
            );

            // Apply easing movement
            const newPosition = currentPosition.lerp(desiredPosition, dt * this.followSpeed);
            this.node.position = newPosition;

            this.flyCold -= dt
            if (this.flyCold <= 0) {
                this.flyCold = GameManager.instance.getFlyCold()
                this.fireBullet()
            }
        }
    }

    onDestroy(): void {

        // Clean up
        this.stopFiring();
    }
}
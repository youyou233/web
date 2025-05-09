import AudioManager from "../manager/audio_manager"
import GameManager from "../manager/game_manager";
import GameUI from "../ui/game_ui";

const { ccclass, property } = cc._decorator

@ccclass
export default class ItemHelper extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null;

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

        // Start firing automatically
        this.startFiring();
    }

    setTarget(targetNode: cc.Node): void {
        this.target = targetNode;
    }

    startFiring(): void {
        if (this._fireInterval) {
            clearInterval(this._fireInterval);
        }

        this._fireInterval = setInterval(() => {
            this.fireBullet();
        }, 1000 / this.fireRate);
    }

    stopFiring(): void {
        if (this._fireInterval) {
            clearInterval(this._fireInterval);
            this._fireInterval = null;
        }
    }

    fireBullet(): void {
        if (!this._canFire) return;


        let maxNum = GameManager.instance.getFlyAtkNum()
        // switch (DD.instance.playerData.flyEquip) {
        //     case 1:
        //         AudioManager.instance.playAudio("pistol1")
        //         for (let i = 0; i < maxNum; i++) {
        //             let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
        //             node.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getFlyAtk(), {
        //                 spd: cc.v2(-0.342, 0.939),
        //                 startPos: GameManager.instance.getFlyStartPos(Utils.getNodeUsePos(this._view.nodeWeapon1), i, maxNum),
        //                 bullet: 1,
        //                 through: maxNum
        //             })

        //             let node2 = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
        //             node2.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getFlyAtk(), {
        //                 spd: cc.v2(0.342, 0.939),
        //                 startPos: GameManager.instance.getFlyStartPos(Utils.getNodeUsePos(this._view.nodeWeapon2), i, maxNum),
        //                 bullet: 1,
        //                 through: maxNum
        //             })
        //         }
        //         break
        //     case 2:
        //         AudioManager.instance.playAudio("AKM")
        //         for (let i = 0; i < maxNum; i++) {
        //             let node = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
        //             node.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getFlyAtk(), {
        //                 spd: GameManager.instance.getFlyArr(cc.v2(-0.342, 0.939), i, maxNum),
        //                 startPos: GameManager.instance.getFlyStartPos(Utils.getNodeUsePos(this._view.nodeWeapon1), i, maxNum),
        //                 bullet: 4
        //             })

        //             let node2 = PoolManager.instance.createObjectByName("flyItem", GameUI.instance.view.nodeContainer)
        //             node2.getComponent(FlyItem).init(GroupType.player, GameManager.instance.getFlyAtk(), {
        //                 spd: GameManager.instance.getFlyArr(cc.v2(0.342, 0.939), i, maxNum),
        //                 startPos: GameManager.instance.getFlyStartPos(Utils.getNodeUsePos(this._view.nodeWeapon2), i, maxNum),
        //                 bullet: 4
        //             })
        //         }
        //         break
        //     case 3:
        //         AudioManager.instance.playAudio("Explosion")
        //         for (let i = 0; i <  Math.ceil(maxNum / 2); i++) {
        //             let node = PoolManager.instance.createObjectByName("trackFlyItem", GameUI.instance.view.nodeContainer)
        //             node.getComponent(TrackFlyItem).init(GameManager.instance.getFlyAtk(), {
        //                 spd: cc.v2(0, 1),
        //                 startPos: Utils.getNodeUsePos(this._view.nodeWeapon1),
        //                 bullet: 6
        //             })

        //             let node2 = PoolManager.instance.createObjectByName("trackFlyItem", GameUI.instance.view.nodeContainer)
        //             node2.getComponent(TrackFlyItem).init(GameManager.instance.getFlyAtk(), {
        //                 spd: cc.v2(0, 1),
        //                 startPos: Utils.getNodeUsePos(this._view.nodeWeapon2),
        //                 bullet: 6
        //             })
        //         }
        //         break
        //     case 4:
        //         AudioManager.instance.playAudio("laser3")
        //         for (let i = 0; i < maxNum; i++) {
        //             let node = PoolManager.instance.createObjectByName("lightItem", GameUI.instance.view.nodeContainer)
        //             node.getComponent(ItemLight).init(GameManager.instance.getFlyAtk(), Utils.getNodeUsePos(this._view.nodeWeapon1), GameManager.instance.getFlyArr(cc.v2(-0.342, 0.939), i, maxNum))

        //             let node2 = PoolManager.instance.createObjectByName("lightItem", GameUI.instance.view.nodeContainer)
        //             node2.getComponent(ItemLight).init(GameManager.instance.getFlyAtk(), Utils.getNodeUsePos(this._view.nodeWeapon2), GameManager.instance.getFlyArr(cc.v2(0.342, 0.939), i, maxNum))
        //         }
        //         break
        // }




    }


    onClick() {
        // Cycle through bullet types when clicked
        this._currentBulletType = (this._currentBulletType + 1) % this.bulletPrefabs.length;
    }

    onUpdate(dt: number): void {
        // Follow target with circular arrangement
        if (this.target && this.target.isValid) {
            const targetPosition = this.target.position;
            const currentPosition = this.node.position;

            // Calculate the total number of active helpers
            const totalHelpers = GameUI.instance.helperNum

            // Calculate the angle for this helper (equally distributed around the circle)
            // Start from the top (90 degrees) and go clockwise
            const angleInRadians = (Math.PI * 2 * this._helperIndex / totalHelpers) + (Math.PI / 2);

            // Calculate the desired position in a circle around the target
            const desiredPosition = cc.v3(
                targetPosition.x + Math.cos(angleInRadians) * this.circleRadius,
                targetPosition.y + Math.sin(angleInRadians) * this.circleRadius,
                targetPosition.z
            );

            // Apply easing movement
            const newPosition = currentPosition.lerp(desiredPosition, dt * this.followSpeed);
            this.node.position = newPosition;

            this.flyCold -= dt
            if (this.flyCold <= 0) {
                this.flyCold = GameManager.instance.getFlyCold()
            }
        }
    }

    onDestroy(): void {

        // Clean up
        this.stopFiring();
    }
}
import PoolManager from "../manager/pool_manager"
import ResourceManager from "../manager/resources_manager"

const { ccclass, property } = cc._decorator

@ccclass
export default class ItemPartical extends cc.Component {
    partical: cc.ParticleSystem = null
    cb: Function = null
    protected onLoad(): void {
        this.partical = this.node.getChildByName("par").getComponent(cc.ParticleSystem)
    }
    init(effect: string, pos: cc.Vec2, end: cc.Vec2, cb) {
        this.cb = cb
        ResourceManager.instance.getPartical(effect).then((res) => {
            this.partical.stopSystem()
            this.partical.file = res
            this.partical.custom = false
            this.partical.resetSystem()
        })
        this.node.setPosition(pos)
        this.showMoveTween(pos, end)
    }
    showMoveTween(start: cc.Vec2, end: cc.Vec2) {
        let isUnder = end.y > start.y
        let isRight = end.x > start.x
        let waveA = (isRight ? -35 : 35)
        let waveB = (isUnder ? -35 : 35)
        let time = start.sub(end).mag() / 200
        let point1 = cc.v2(waveA + (start.x - end.x) / 2, waveB + (start.y - end.y) / 2)
        cc.tween(this.node)
            .bezierTo(time, start, point1, end)
            .call(() => {
                if (this.cb) this.cb()
                this.closeNode()
            })
            .start()
    }
    closeNode() {
        this.partical.stopSystem()
        setTimeout(() => {
            PoolManager.instance.removeObject(this.node)
        }, 500);
    }
}
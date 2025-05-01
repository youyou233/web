import ResourceManager from "../manager/resources_manager"

const { ccclass, property } = cc._decorator

@ccclass
export default class ParticalItem extends cc.Component {
    @property(cc.ParticleSystem)
    partical: cc.ParticleSystem = null
    init(name: string) {
        ResourceManager.instance.getPartical(name).then(res => {
            this.partical.file = res
            this.partical.resetSystem()
        })
    }
}
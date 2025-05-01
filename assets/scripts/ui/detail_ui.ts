import ActionManager from "../manager/action_manager"
import AudioManager from "../manager/audio_manager"
import { Utils } from "../utils/utils"
import { Emitter } from "../utils/emmiter"
import DetailUIView from "../ui_view/panel/detail_ui_view"
import JsonManager from "../manager/json_manager"
import ResourceManager from "../manager/resources_manager"
import { ResType } from "../utils/enum"


const { ccclass, property } = cc._decorator

//强化页面
@ccclass
export default class DetailUI extends cc.Component {
    static instance: DetailUI = null
    private _view: DetailUIView = new DetailUIView()
    onLoad() {
        this._view.initView(this.node)
        DetailUI.instance = this
        this._bindEvent()
    }
    private _bindEvent() {
        this._view.nodeBg.active = false
        //this._view.btnBack.node.on("click", this.hideUI, this)
    }
    showUI() {
        //  ActionManager.instance.fadeShowDialog(this._view.content)
    }

    setDetailHeader(ac: boolean, name?: string, dec?: string, spr?: string) {
        if (ac) {

            this._view.labName.string = name
            this._view.labDec.string = dec
            this._view.sprMain.spriteFrame = ResourceManager.instance.getSprite(ResType.main, spr)

            this.playShowAnima()
        } else {
            this.playHideAnima()
        }
    }

    // setAchieveHeader(id: number) {
    //     this.node.zIndex = 501
    //     let info = JsonManager.instance.getDataByName("achievement")[id] as AchievementData
    //     switch (info.rewardType) {
    //         case 2:
    //             let buildInfo = JsonManager.instance.getDataByName("build")[info.rewardNum] as BuildInfo
    //             this._view.sprMain.spriteFrame = ResourceManager.instance.getSprite(ResType.main, "build_" + info.rewardNum)
    //             this._view.labHeadName.string = buildInfo.name + " 建筑图纸解锁！"
    //             this._view.labHeadDec.string = buildInfo.dec
    //             break
    //         case 3:
    //             let equipInfo = JsonManager.instance.getDataByName("equip")[info.rewardNum] as EquipInfo
    //             this._view.sprMain.spriteFrame = ResourceManager.instance.getSprite(ResType.main, "item-" + equipInfo.sprList[0])
    //             this._view.labHeadName.string = equipInfo.name + " 将在游戏中出现！"
    //             this._view.labHeadDec.string = equipInfo.dec
    //             break
    //         case 1:
    //             let roleInfo = JsonManager.instance.getDataByName("role")[info.rewardNum] as RoleInfo
    //             this._view.sprMain.spriteFrame = ResourceManager.instance.getSprite(ResType.main, "avatar_" + info.rewardNum + "_skin_1")
    //             this._view.labHeadName.string = roleInfo.name + " 将协助你！"
    //             this._view.labHeadDec.string = roleInfo.dec
    //             break
    //     }
    //     this.playAnima()
    //     this.setAvatarScale()
    // }
    setAvatarScale() {
        if (this._view.sprMain.node.width > 34 || this._view.sprMain.node.height > 34) {
            Utils.setSpScale(this._view.sprMain.node, 34)
        } else {
            this._view.sprMain.node.scale = 1
        }
    }
    playAnima() {
        this._view.nodeBg.stopAllActions()
        this._view.nodeBg.active = true
        this._view.nodeBg.y = 90
        cc.tween(this._view.nodeBg)
            .to(0.3, { y: -90 }, cc.easeBounceOut())
            .delay(2)
            .to(0.2, { y: 90 }, cc.easeIn(2))
            .call(() => {

                this._view.nodeBg.active = false
            }).start()
    }
    playShowAnima() {
        this._view.nodeBg.stopAllActions()
        this._view.nodeBg.active = true
        this._view.nodeBg.y = 90
        cc.tween(this._view.nodeBg)
            .to(0.3, { y: -90 }, cc.easeBounceOut())
            .start()
    }
    playHideAnima() {
        this._view.nodeBg.stopAllActions()
        cc.tween(this._view.nodeBg)
            .to(0.2, { y: 90 }, cc.easeIn(2))
            .call(() => {
                this._view.nodeBg.active = false
            }).start()
    }
    hideUI() {
        this._view.content.active = false
    }
}
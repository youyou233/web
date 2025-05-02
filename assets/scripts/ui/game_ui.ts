
import AudioManager from "../manager/audio_manager"
import GameManager from "../manager/game_manager"
import PoolManager from "../manager/pool_manager"
import UIManager from "../manager/ui_manager"
import GameUIView from "../ui_view/panel/game_ui_view"
import { Config } from "../utils/config"
import HomeUI from "./home_ui"
import ShopUI from "./shop_ui"

//主体游戏UI
const { ccclass, property } = cc._decorator

@ccclass
export default class GameUI extends cc.Component {
    static instance: GameUI = null
    view: GameUIView = new GameUIView()
    @property(cc.EffectAsset)
    dissolveEffect: cc.EffectAsset = null

    @property(cc.Material)
    greyEffect: cc.Material = null
    @property(cc.Material)
    normalEffect: cc.Material = null

    //curChoose: ItemCell = null
    maxIndex: number = 1

    onLoad() {
        this.view.initView(this.node)
        GameUI.instance = this
        this.view.content.active = false
        this._bindEvent()
        this.view.nodeEnd.active = true
        cc.tween(this.view.sprRole.node)
            .repeatForever(
                cc.tween()
                    .to(1, { scaleX: -1.05, scaleY: 0.95 })
                    .to(1, { scaleX: -0.95, scaleY: 1.05 })
            ).start()
    }
    private _bindEvent() {
        this.view.btnBack.node.on("click", this.onClickBack, this)
        this.view.btnBuyMoney.node.on("click", () => {
            AudioManager.instance.playAudio("click")
            UIManager.instance.openUI(ShopUI, { name: Config.uiName.shopUI, param: [1] })
        }, this)
        this.view.btnBuyDiamond.node.on("click", () => {

            AudioManager.instance.playAudio("click")
            UIManager.instance.openUI(ShopUI, { name: Config.uiName.shopUI, param: [2] })
        }, this)
        setInterval(() => {
        }, 1000);
    }
    initGame() {
        this.maxIndex = 0
        this.view.content.active = true
        PoolManager.instance.removeObjByContainer(this.view.nodeCostomer)
        AudioManager.instance.playBGM("day")
        setTimeout(() => {
            this.refreshUI()
        
            this.view.nodeEnd.active = false
        });
    }
   
    refreshUI() {
        if (this.view.content.active) {
            this.view.nodeUnlimite.active = GameManager.instance.unlimite
            if (GameManager.instance.unlimite) {
                this.view.nodeOrderContainer.active = false
                this.view.labUnlimiteTime.string = GameManager.instance.unlimiteTimer.toFixed(0) + "秒"
                let num = 0
              
               
            } else {
                this.view.nodeOrderContainer.active = true
                PoolManager.instance.removeObjByContainer(this.view.nodeOrderContainer)
             
            }

        }

    }
   



    getNewMaterial() {
        let material = cc.Material.create(this.dissolveEffect, 0)
        material.define('USE_TINT', true)
        material.define('USE_TEXTURE', true)
        return material
    }
    hideUI() {

        this.view.content.active = false
    }
    setTop(cellNode: cc.Node) {
        cellNode.zIndex = ++this.maxIndex
    }

   
    update(dt) {
        if (!this.view.content.active) return

        //判断是否要获得种子
        if (GameManager.instance.unlimite && GameManager.instance.unlimiteTimer) {
            if (Math.ceil(GameManager.instance.unlimiteTimer) - Math.ceil(GameManager.instance.unlimiteTimer - dt) > 0) {
                this.refreshUI()
            }
            if (GameManager.instance.unlimiteTimer > 0) {
                GameManager.instance.unlimiteTimer -= dt
                if (GameManager.instance.unlimiteTimer <= 0) {
                 //   GameManager.instance.onUnlimiteDone()
                }
            }


        }
    }
    onClickBack() {
        AudioManager.instance.playAudio("click")
        if (GameManager.instance.unlimite) {
            GameManager.instance.unlimiteTimer = -1
            //GameManager.instance.onUnlimiteDone()
        } else {
            this.hideUI()
            HomeUI.instance.showUI()
        }
    }

    
   
}

import FailUI from "../ui/fail_ui"
import GameUI from "../ui/game_ui_old"
import RewardUI from "../ui/reward_ui"
import { Config } from "../utils/config"
import { Emitter } from "../utils/emmiter"
import { GameStatue } from "../utils/enum"
import { MessageType } from "../utils/message"
import { Utils } from "../utils/utils"
import AudioManager from "./audio_manager"
import DD from "./dynamic_data_manager"
import EffectManager from "./effect_manager"
import HelpManager, { limitKeyType } from "./help_manager"
import JsonManager from "./json_manager"
import UIManager from "./ui_manager"

export default class GameManager {
    static _instance: GameManager = null

    static get instance() {
        if (this._instance == null) {
            this._instance = new GameManager()
        }
        return this._instance
    }
    unlimite: boolean = false
    unlimiteTimer: number = 0
 
    state: GameStatue = GameStatue.pause

    // cellSizeX: number = 6
    // cellSizeY: number = 6

    // cellWidth: number = 154
    // cellHeight: number = 154


    //挑战模式
    //一百秒内合成一个七级作物，赢得20爱心 
    //从0开始 期间不记录 成功才记录 
    init(unlimite?) {
        this.unlimite = unlimite
        if (unlimite) {
            this.unlimite = true
            this.unlimiteTimer = 120
        }

        this.state = GameStatue.pause
        GameUI.instance.initGame()
    }


    // getPostionByXY(x, y) {
    //     //计算cell的位置
    //     let posX = x * this.cellWidth - this.cellSizeX / 2 * this.cellWidth + this.cellWidth / 2
    //     let posY = y * this.cellHeight - this.cellHeight * this.cellSizeY / 2 + this.cellHeight / 2
    //     return cc.v2(posX, posY)
    // }

    // getCellByPostion(pos) {
    //     let x = Math.floor((pos.x + GameManager.instance.cellSizeX / 2 * this.cellWidth) / this.cellWidth)
    //     let y = Math.floor((pos.y + this.cellHeight * GameManager.instance.cellSizeY / 2) / this.cellHeight)
    //     return GameUI.instance.getCellByXy(x, y)
    // }
    // getXyByPostion(pos): number[] {
    //     let x = Math.floor((pos.x + GameManager.instance.cellSizeX / 2 * this.cellWidth) / this.cellWidth)
    //     let y = Math.floor((pos.y + this.cellHeight * GameManager.instance.cellSizeY / 2) / this.cellHeight)
    //     return [x, y]
    // }

    // getRandomCell() {
    //     return Utils.getRandomNumber(6) + 1
    // }

  
}
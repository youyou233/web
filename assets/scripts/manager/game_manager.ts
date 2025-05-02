

import GameUI from "../ui/game_ui"
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

}
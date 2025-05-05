

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
    getFlyStartPos(oriPos: cc.Vec2, index: number, maxNum: number) {
        let gapX = 12
        let maxLeftPos = gapX / 2 * (maxNum - 1)
        let gapY = 6
        let leftX = oriPos.x - maxLeftPos + gapX * index
        return cc.v2(leftX
            , oriPos.y - Math.abs(index - maxNum / 2) * gapY)

    }
   
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

    water: number = 0 
    

    //挑战模式
    init(unlimite?) {
        this.unlimite = unlimite
        if (unlimite) {
            this.unlimite = true
            this.unlimiteTimer = 120
        }

        this.state = GameStatue.pause
        GameUI.instance.initGame()
    }

    //浇水种植物


    getFlyAngle(vec: cc.Vec2, index, maxNum, gap) {
        let maxLeft = gap / 2 * (maxNum - 1)
        return Utils.getAngle(vec) + maxLeft - gap * index
    }

    getFlyArr(vec: cc.Vec2, index, maxNum, gap: number = 5) {
        let angle = this.getFlyAngle(vec, index, maxNum, gap)
        return Utils.getNormalDivByAngel(angle)
        // let num =this.
    }

    getRoleCold() {
        let lv = DD.instance.playerData.roleMap[DD.instance.playerData.roleEquip]
        return 1 * Math.pow(0.99, lv - 1)
    }
    getRoleAtkNum() {
        let lv = DD.instance.playerData.roleMap[DD.instance.playerData.roleEquip]
        return 1 + Math.ceil(Math.sqrt(lv - 1))
    }
    getRoleMaxHp() {
        let lv = DD.instance.playerData.roleMap[DD.instance.playerData.roleEquip] * 5
        for (let id in DD.instance.playerData.roleMap) {
            lv += DD.instance.playerData.roleMap[id]
        }
        return 10 + (lv - 1) * 2
    }
    getRoleAtk() {
        let lv = DD.instance.playerData.roleMap[DD.instance.playerData.roleEquip]

        return 2 + Math.sqrt(lv - 1)
    }
    getFlyCold() {
        let lv = DD.instance.playerData.flyMap[DD.instance.playerData.flyEquip]
        return 1 * Math.pow(0.99, lv - 1)
    }
    getFlyAtkNum() {
        let lv = DD.instance.playerData.flyMap[DD.instance.playerData.flyEquip]
        return 1 + Math.ceil(Math.sqrt(lv - 1))
    }
    getFlyAtk() {
        let lv = DD.instance.playerData.flyMap[DD.instance.playerData.flyEquip]
        for (let id in DD.instance.playerData.flyMap) {
            lv += DD.instance.playerData.flyMap[id] / 2
        }
        return 1 + Math.sqrt(lv - 1) * 2
    }

    //5的倍数的关卡刷boss
    getAllEnemyNum(lv: number) {
        if (lv % 5 == 0) {
            return Math.ceil(lv / 5)
        } else {
            return 10 + lv
        }
    }
    getRefreshEnemyTimer(lv: number) {
        if (lv % 5 == 0) {
            return 5
        } else {
            return Math.pow(0.99, lv)
        }
    }

    getEnemyMaxHp(lv: number) {
        let hp = 0
        if (lv % 5 == 0) {
            hp = 10 + (lv - 1) * 4
        } else {
            hp = 2 + lv - 1
        }
        if (this.unlimite) {
            hp *= lv
        }
        return hp
    }
    getEnemyAtk(lv) {
        if (lv % 5 == 0) {
            return 1 + (lv - 1) / 2
        } else {
            return 1 + (lv - 1)
        }
    }

    getEnemyCold(lv: number) {
        return 3 * Math.pow(0.99, lv)
    }
}
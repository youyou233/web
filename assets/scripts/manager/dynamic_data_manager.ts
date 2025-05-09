import { ConfigData } from "../interface/config_data"
import { PlayerData } from "../interface/player_data"
import DailyUI from "../ui/daily_ui"
import LevelupUI from "../ui/levelup_ui"
import { Config } from "../utils/config"
import { Emitter } from "../utils/emmiter"
import { MessageType } from "../utils/message"
import { Utils } from "../utils/utils"
import GameManager from "./game_manager"
import HelpManager, { limitKeyType } from "./help_manager"
import HttpManager from "./http_manager"
import MainManager from "./main_manager"
import StorageManager from "./storage_manager"
import UIManager from "./ui_manager"

const { ccclass, property } = cc._decorator
/**
 * 此文件用于控制游戏中所有数据 以及可视化绑定
 */
@ccclass
export default class DD extends cc.Component {
    static _instance: DD = null

    static get instance() {
        if (this._instance == null) {
            this._instance = new DD()
        }
        return this._instance
    }
    config: ConfigData = {
        music: 0.5,
        audio: 0.5,
        version: "1.0"
    }

    playerData: PlayerData = {
        id: "",
        nickName: "",
        uid: "",
        money: 0,
        diamond: 0,
        health: 0,

        roleMap: { 1: 1, 2: 0, 3: 0, 4: 0 },//助手解锁 好像没有升级
        flyMap: { 1: 1, 2: 0, 3: 0, 4: 0 },
        signDay: 0,//已签到日数
        lastSign: 0,//上次签到时间
        lastDaliy: 0,//上次每日福利时间
        lastReward: 0,//上次收益放置时间

        roleEquip: 1,
        flyEquip: 1,

        lvData: [],
    }
    saveTimer: any = null
    initData(data) {
        data = JSON.parse(data)
        if (data.buildMap == undefined) {
            cc.log("旧数据存档")
            this.saveNewData(data.id, data.nickName, data.uid)
        } else {
            this.playerData = data
        }

    }
    saveNewData(account?, nickName?, uid?) {
        this.playerData.id = account
        this.playerData.uid = uid
        this.playerData.nickName = nickName
        this.playerData.lastReward = new Date().getTime()
        this.saveTimer = setTimeout(() => {
            HttpManager.instance.newRequest(`${Config.serverIP}`, {
                requestCode: "updateData",
                account: this.playerData.id,
                saveData: JSON.stringify(this.playerData),
            }).then((res: any) => {
                if (res.code == -1) {
                    UIManager.instance.LoadTipsByStr(res.msg)
                    return
                }
            })
        }, 1000);
    }

    saveData() {
        this.checkKick()
        HelpManager.instance.rateLimit(limitKeyType.save, this.askSave.bind(this))()
    }
    askSave() {
        if (GameManager.instance.unlimite && GameManager.instance.unlimiteTimer > 0) return
        HttpManager.instance.newRequest(`${Config.serverIP}`, {
            requestCode: "updateData",
            account: this.playerData.id,
            saveData: JSON.stringify(this.playerData),
        }).then((res: any) => {
            if (res.code == -1) {
                UIManager.instance.LoadTipsByStr(res.msg)
                return
            }
            this.saveTimer = null
        })
    }
    onSign() {
        let data = new Date().getTime()
        if (!Utils.isSameDay(data, this.playerData.lastSign)) {
            this.playerData.lastSign = data
            this.addMoney(100)
            UIManager.instance.LoadTipsByStr("签到成功，获得：" + 100 + "金币。")
        } else {
            UIManager.instance.LoadTipsByStr("今日已签到。")
        }
        this.saveData()
    }
    onDaliy() {
        let data = new Date().getTime()
        if (!Utils.isSameDay(data, this.playerData.lastDaliy)) {
            UIManager.instance.openUI(DailyUI, { name: Config.uiName.daliyUI })
        } else {
            UIManager.instance.LoadTipsByStr("今日已领取。")
        }
        this.saveData()
    }


    addMoney(num: number) {
        this.playerData.money += num
        Emitter.fire(MessageType.moneyChange)
        this.saveData()
    }
    addDiamond(num: number) {
        this.playerData.diamond += num
        Emitter.fire(MessageType.diamondChange)
        this.saveData()
    }
    addHealth(num: number) {
        this.playerData.health += num
        Emitter.fire(MessageType.healthChange)
        this.saveData()
    }


    unlockRole(id) {
        let price = [0, 100, 500, 200, 500, 1000]
        if (id <= 2) {
            this.addMoney(-price[id])
        } else {
            this.addDiamond(-price[id])
        }
        this.playerData.roleMap[id] = 1
        this.saveData()
    }


    //升级
    onLevelup(id) {
        this.addMoney(-100 * this.playerData.roleMap[id])
        this.playerData.roleMap[id]++

        LevelupUI.instance.refreshUI()
        this.saveData()
    }

    unlockFly(id) {
        let price = [0, 100, 500, 200, 500, 1000]
        if (id <= 2) {
            this.addMoney(-price[id])
        } else {
            this.addDiamond(-price[id])
        }
        this.playerData.flyMap[id] = 1
        this.saveData()
    }


    //升级
    onLevelupFly(id) {
        this.addMoney(-100 * this.playerData.roleMap[id])
        this.playerData.flyMap[id]++

        LevelupUI.instance.refreshUI()
        this.saveData()
    }
    checkKick() {
        let age = MainManager.instance.getAgeFromID(this.playerData.uid)
        if (age == 0) {
            cc.log("账号数据异常")
            return
        }
        if (age < 18 && this.isWeekendEvening(new Date().getTime())) {
            UIManager.instance.LoadMessageBox("游玩提示", "您今日累计游戏时间已超过1个小时，您今日将无法登陆游戏。根据防沉迷系统相关规定，未成年人仅可在周五、周六、周日和法定节假日每日20时至21时游玩，请合理安排游戏时间，劳逸结合。点击“确定”即可退出游戏。", (isOK) => {
                cc.game.end()
            }, null, false)
        }
    }
    isWeekendEvening(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDay(); // 获取星期几 (0表示周日, 6表示周六)
        const hours = date.getHours(); // 获取小时

        // 判断是否是周五、周六或周日，且时间在21时或之后
        return (
            (day === 5 || day === 6 || day === 0) && // 周五、周六、周日
            hours >= 21
        );
    }
    saveConfig() {
        StorageManager.instance.saveDataByKey('config', this.config)
    }

    onPassLv(star: number) {
        if (!this.playerData.lvData[star]) {
            this.playerData.lvData[star] = star
        } else {
            this.playerData.lvData[star] = Math.max(this.playerData.lvData[star], star)
        }
    }
    equipFly(id) {
        this.playerData.flyEquip = id
        Emitter.fire(MessageType.equipFly)
        this.saveData()
    }
}

import HomeUI from "../ui/home_ui";
import LoginUI from "../ui/login_ui";
import { Config } from "../utils/config";
import DD from "./dynamic_data_manager";
import GameManager from "./game_manager";
import HttpManager from "./http_manager";
import ResourceManager from "./resources_manager";
import StorageManager from "./storage_manager";
import UIManager from "./ui_manager";

const { ccclass, property } = cc._decorator;

declare global {
    interface Window {
        winSize: any
    }
}
@ccclass
export default class MainManager extends cc.Component {
    static instance: MainManager = null
    timer: number = 0
    onLoad() {
        MainManager.instance = this
        // cc.director.getCollisionManager().enabled = true; //开启碰撞检测，默认为关闭
        // var manager = cc.director.getCollisionManager() 
        // manager.enabled = true
        cc.macro.ENABLE_MULTI_TOUCH = false
        this.setDesignResolution()
        ResourceManager.instance.init()
    }
    resLoaded() {
        console.log('资源加载完毕')
        let configData = StorageManager.instance.loadDataByKey('config')
        if (configData) {
            DD.instance.config = configData
        } else {
            DD.instance.saveConfig()
        }
        LoginUI.instance.showUI()

        //   HomeUI.instance.showUI()
        //展示开始按钮
        //判断是否初次开始游戏
       //GameManager.instance.init()
        // AudioManager.instance.init()
    }

    //适配
    setDesignResolution() {
        var canvas = cc.find("Canvas").getComponent(cc.Canvas)
        var winSize = cc.winSize
        window.winSize = winSize
        if (winSize.width / winSize.height > 640 / 1334) {
            canvas.fitWidth = false
            canvas.fitHeight = true
        } else {
            canvas.fitWidth = true
            canvas.fitHeight = false
        }
    }

    getAgeFromID(idCard) {
        if (!/^\d{17}(\d|X)$/i.test(idCard)) {
            return 0;
        }

        // 获取出生日期部分
        const birthYear = parseInt(idCard.substring(6, 10), 10);
        const birthMonth = parseInt(idCard.substring(10, 12), 10) - 1; // 月份从0开始
        const birthDay = parseInt(idCard.substring(12, 14), 10);

        const birthDate = new Date(birthYear, birthMonth, birthDay);
        const today = new Date();

        // 计算年龄
        let age = today.getFullYear() - birthYear;
        if (
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
        ) {
            age--; // 还没过生日，年龄减一
        }

        return age;
    }
}

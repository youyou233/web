export interface PlayerData {
    flyMap: any
    flyEquip: any
    roleEquip: any
    id: string
    nickName: string
    uid: string

    money: number
    diamond: number
    health: number

    signDay: number
    lastSign: number//上次签到时间
    lastDaliy: number//上次每日福利时间
    lastReward: number
    roleMap: { [key: number]: any }
}


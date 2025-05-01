import UIManager from "./ui_manager"

interface HttpCallBack {
    (isOK: boolean, data: any): void
}
//--user-data-dir="C:/Chrome dev session" --disable-web-security
export default class HttpManager {
    static _instance: HttpManager = null

    static get instance() {
        if (this._instance == null) {
            this._instance = new HttpManager()
        }
        return this._instance
    }
    android: boolean = cc.sys.platform == cc.sys.ANDROID
    private queue: Array<string> = [] // 请求队列

    request(url: string, keyValues: {}, callback: HttpCallBack = null) {

        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                const response = xhr.responseText

                // console.log(response)
                if (callback != null) {
                    try {
                        let result = JSON.parse(response)
                        callback(true, result)
                    } catch (e) {
                        callback(false, {})
                        console.error("数据错误:", response.toString())
                    }
                }
            }
        }
        xhr.onerror = function (e) {
            console.log("error:" + e)
            callback(false, null)
        }

        xhr.open("POST", url, true)
        xhr.send(JSON.stringify(keyValues))

    }

    /**
     * 发送请求
     * @param {string} url 链接地址
     * @param {object} keyValues 参数
     * @param {string} method   请求方式: POST或者GET
     * @param {number} retryTimes 剩余重连次数
     * @param retryCallback 重连回调
     * @param isPushQueue 是否进入队列
     * @returns {Promise} Promise
     */
    newRequest(
        url: string,
        keyValues: object,
        method: string = "POST",
        retryTimes: number = 5,
        retryCallback = (times) => { },
        isPushQueue: boolean = true
    ) {
        if (this.android) {
            let networkType = cc.sys.getNetworkType();

            if (networkType === cc.sys.NetworkType.NONE) {
                return new Promise((resolve, reject) => {
                    UIManager.instance.LoadTipsByStr("网络未连接。")
                    reject("重复请求。")
                })
            }

        }


        // console.log("request:" + url)
        if (this.isInQueue(url)) {
            return new Promise((resolve, reject) => {
              //  UIManager.instance.LoadTipsByStr("网络请求中。")
                reject("重复请求。")
            })
        }

        if (isPushQueue) {
            this.queue.push(url)
        }
        return new Promise((resolve, reject) => {
            let times = retryTimes
            let delay = 2000

            let attemptFunc = () => {
                HttpManager.instance
                    .xhrProcess(url, keyValues, method)
                    .then(resolve)
                    .catch(function (err) {
                        console.log(`还有 ${times} 次尝试: ` + err)
                        if (0 == times) {
                            if (retryCallback != null) {
                                retryCallback(times)
                            }
                            reject(err)
                        } else {
                            if (retryCallback != null) {
                                retryCallback(times)
                            }
                            times--
                            setTimeout(attemptFunc, delay)
                        }
                    })
            }

            attemptFunc()
        })
    }

    private xhrProcess(url: string, keyValues: object, method: string) {
        return new Promise(function (resolve, reject) {

            let xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                    let response = xhr.responseText
                    // console.log('response: ', response)
                    HttpManager.instance.removeQueue(url)
                    try {
                        let result = JSON.parse(response)
                        resolve(result)
                    } catch (e) {
                        reject(e)
                        console.error("无法解析为合法JSON")
                    }
                }
            }
            xhr.onerror = function (e) {
                // console.log("xhr onError:" + e)
                reject(e)
            }
            if (method == "POST") {
                xhr.open("POST", url, true)
                // xhr.timeout = 6000 // 超时6s
                // switch (PlatformManager.instance.platform) {
                //     case Platform.Android:
                //     case Platform.IOS:
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
                //         break
                // }
                // debugger
                // xhr.setRequestHeader('Access-Control-Allow-Origin', ' http://localhost:7456')

                // xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
                //console.log(xhr.getAllResponseHeaders())
                xhr.send(JSON.stringify(keyValues))
            } else if (method == "GET") {
                let index = 0,
                    valueString = ""
                for (let i in keyValues) {
                    if (index == 0) {
                        valueString += `?${i}=${keyValues[i]}`
                    } else {
                        valueString += `&${i}=${keyValues[i]}`
                    }
                    index++
                }
                // console.log("GET URL: ", url + valueString)
                xhr.open("GET", url + valueString, true)
                xhr.send()
            }

        })
    }

    /**
     * 是否已经在队列中
     * @param {string} url 链接地址
     */
    private isInQueue(url: string) {
        for (let i = 0, length = this.queue.length; i < length; i++) {
            if (url == this.queue[i]) {
                return true
            }
        }
        return false
    }

    /**
     * 移出队列
     * @param {string} url 链接地址
     */
    private removeQueue(url: string) {
        for (let i = 0, length = this.queue.length; i < length; i++) {
            if (url == this.queue[i]) {
                this.queue.splice(i, 1)
            }
        }
    }
}

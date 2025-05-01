export default class HelpManager {
    static _instance: HelpManager = null

    static get instance() {
        if (this._instance == null) {
            this._instance = new HelpManager()
        }
        return this._instance
    }

    private limits: Map<string, number> = new Map()
    debounceMap: { [key: number]: any } = {}

    //限流 立即生效一次 后面的生效需要间隔时间
    rateLimit<T>(key, cb: () => T, limitTime: number = 2000) {
        return () => {
            const now = Date.now();
            const lastCall = this.limits.get(key);
            if (!lastCall || (now - lastCall) >= limitTime) {
                this.limits.set(key, now);
                return cb();
            }
        }

    }

    //防抖 第一次不生效 但是最后一次之后生效
    public debounce<T>(key, callback: Function, wait: number = 2000) {
        let lastCall = this.debounceMap[key]
        if (lastCall) {
            clearTimeout(lastCall);
            this.debounceMap[key] = setTimeout(() => {
                callback()
            }, wait);
        } else {
            this.debounceMap[key] = setTimeout(() => {
                callback()
            }, wait);
        }
        // const debounced = () => {
        //     const later = () => {
        //         clearTimeout(this.debounceMap.get(key));
        //         this.debounceMap.delete(key);
        //         callback();
        //     };
        //     clearTimeout(this.debounceMap.get(key));
        //     this.debounceMap.set(key, setTimeout(later, wait));
        // };
        // return debounced;
    }

    // public clearDebouncer(key: string): void {
    //     clearTimeout(this.debounceMap.get(key));
    //     this.debounceMap.delete(key);
    // }

}

export enum limitKeyType {
    save
}
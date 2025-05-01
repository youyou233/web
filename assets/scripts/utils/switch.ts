const { ccclass, property } = cc._decorator;

@ccclass
export default class SwitchMask extends cc.Component {
    static instance: SwitchMask = null

    materaial: cc.Material = null

    protected onLoad(): void {
        SwitchMask.instance = this
        let node = this.node;
        this.materaial = node.getComponent(cc.Sprite).getMaterial(0);
        this.materaial.setProperty('amount', 0);
        this.materaial.setProperty('size', [this.node.width, this.node.height]);
        this.materaial.setProperty('cellSize', 75.0);
        this.materaial.setProperty('rotation', 45.0);
        this.node.zIndex = 999
    }

    onSwitch(cb: Function) {
        this.startSwitch()
        setTimeout(() => {
            cb()
            this.endSwitch()
        }, 450);
    }

    startSwitch() {
        const _proxy = new Proxy({ amount: 0.0 }, {
            set(target, key, value) {
                target[key] = value;
                if (key == 'amount') {
                    SwitchMask.instance.materaial.setProperty('amount', value);
                }
                return true;
            }
        })
        cc.tween(_proxy).to(.3, { amount: 15.0 }).start();
    }
    endSwitch() {
        const _proxy = new Proxy({ amount: 15 }, {
            set(target, key, value) {
                target[key] = value;
                if (key == 'amount') {
                    SwitchMask.instance.materaial.setProperty('amount', value);
                }
                return true;
            }
        })
        cc.tween(_proxy).to(0.4, { amount: 0 }).start();
    }
}
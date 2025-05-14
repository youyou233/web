import EffectManager from "../manager/effect_manager"
import ResourceManager from "../manager/resources_manager"

const { ccclass, property } = cc._decorator
@ccclass
export default class CanvasUI extends cc.Component {
    static instance: CanvasUI = null
    @property(cc.Node)
    effectContainer: cc.Node = null
    onLoad() {
        CanvasUI.instance = this
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            //         cc.log('capture检测到点击事件')
            if (ResourceManager.instance.loading != 3) return
            this.effectContainer.zIndex = 501
            EffectManager.instance.createEffect('shine0012', event.getLocation().sub(cc.v2(window.winSize.width / 2, window.winSize.height / 2)), this.effectContainer)
        }, this, true)
        this.node['_touchListener'].setSwallowTouches(false)
        // cc.systemEvent.on('click', () => {
        //     cc.log('systemEvenet检测到点击事件')
        // }, this)
        //  this.node['_touchListener'].setSwallowTouches(false)
        //  this.node['_touchListener'].swallowTouches = false
        //this.node['_touchListener'].setSwallowTouches(false)
        //debugger
        // this.node.on('click', () => {
        //     cc.log('检测到点击事件')
        // }, this)
        // let touchListener = cc.Event.create({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: false,
        //     owner: this,
        //     onTouchBegan: (event) => {
        //         // 做你想做的事情
        //     },
        //     // onTouchMoved: _touchMoveHandler,
        //     // onTouchEnded: _touchEndHandler,
        //     // onTouchCancelled: _touchCancelHandler
        // });
        // cc.internal.eventManager.addListener(touchListener, -1);
        this.setDesignResolution()
    }
    start() {
        let cam = new cc.Node("CameraClearStencil");
        let c = cam.addComponent(cc.Camera);
        cc.find("Canvas").addChild(cam);
        cam.groupIndex = 1;
        c.clearFlags = cc.Camera.ClearFlags.DEPTH | cc.Camera.ClearFlags.STENCIL;
        c.depth = 10;
        c.cullingMask = 0;

    }
    setDesignResolution() {
        var canvas = this.node.getComponent(cc.Canvas)
        //cc.log(cc.view.getFrameSize())
        var winSize = cc.view.getFrameSize()//cc.sys.getSafeAreaRect()//.getWinSize()
        window.winSize = cc.winSize
        if (winSize.width / winSize.height >= 750 / 1334) {
            canvas.fitWidth = false
            canvas.fitHeight = true
        } else {
            canvas.fitWidth = true
            canvas.fitHeight = false
        }
    }
}
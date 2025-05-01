
const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemJoyStick extends cc.Component {

    @property(cc.Node)
    stick: cc.Node = null;
    @property(cc.Node)
    nodePos: cc.Node = null;

    max_radius = 40;
    start_pos = null;
    is_move = false;
    dir = cc.v2(0, 0);
    start() {
        this.addTouchListener();
    }

    //自定义函数
    addTouchListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.is_move = true;
            this.start_pos = event.getLocation();
            let p_pos = this.node.convertToNodeSpaceAR(this.start_pos);
            let l_pos = this.nodePos.convertToNodeSpaceAR(this.start_pos);
            this.nodePos.setPosition(p_pos)
            this.stick.setPosition(cc.v2(0));
            this.dir = cc.v2(0)
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            this.is_move = true;
            let w_pos = event.getLocation();
            let s_pos = w_pos.sub(this.start_pos);
            let l_pos: cc.Vec2 = cc.v2(0, 0);
            if (s_pos.mag() > this.max_radius) {
                l_pos.x = this.max_radius * s_pos.x / s_pos.mag();
                l_pos.y = this.max_radius * s_pos.y / s_pos.mag();
            } else {
                l_pos = this.nodePos.convertToNodeSpaceAR(w_pos);
            }
            this.stick.setPosition(l_pos);

            //圆心处较灵敏，去掉半径为5的圆
            if (l_pos.mag() > 5) {
                this.dir.x = l_pos.x / this.max_radius;
                this.dir.y = l_pos.y / this.max_radius;
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.is_move = false;
            this.stick.setPosition(cc.v2(0, 0));
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.is_move = false;
            this.stick.setPosition(cc.v2(0, 0));
        }, this);
    }

    isMove() {
        return this.is_move;
    }

    getDir() {
        return this.dir;
    }

    getMaxRadius() {
        return this.max_radius;
    }
}



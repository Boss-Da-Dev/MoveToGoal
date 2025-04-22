import { _decorator, CCBoolean, CCFloat, Collider, Component, Node, tween, Vec3 } from 'cc'
const { ccclass, property } = _decorator

@ccclass('MoveFloor')
export class MoveFloor extends Component {
    @property(Collider)
    private colliderCheck: Collider

    @property(CCFloat)
    private moveTime: number = 1

    @property(CCFloat)
    private xOffsetMove: number

    @property(CCFloat)
    private yOffsetMove: number

    @property(CCFloat)
    private zOffsetMove: number

    @property(CCBoolean)
    private isTween: boolean

    private isTrigger: boolean = false
    private isDrop: boolean = false

    start() {
        this.colliderCheck ??= this.getComponent(Collider)
        this.isTrigger = this.colliderCheck.isTrigger

        if (this.isTrigger) this.colliderCheck.on('onTriggerEnter', this.dropObject, this)
        else this.colliderCheck.on('onCollisionEnter', this.dropObject, this)
    }

    private dropObject() {
        if (!this.isDrop) {
            this.isDrop = true
            if (this.isTween) {
                tween(this.node)
                    .by(this.moveTime, {
                        position: new Vec3(this.xOffsetMove, this.yOffsetMove, this.zOffsetMove),
                    })
                    .start()
            } else {
                this.node.setPosition(
                    new Vec3(
                        this.node.position.x + this.xOffsetMove,
                        this.node.position.y + this.yOffsetMove,
                        this.node.position.z + this.zOffsetMove
                    )
                )
            }
        }
    }
}

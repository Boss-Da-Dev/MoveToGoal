import { _decorator, CCFloat, Component, Node, Vec2, Vec3 } from 'cc'
const { ccclass, property } = _decorator

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(Node)
    private playerNode: Node
    private offset: Vec3

    start() {
        this.offset = new Vec3(
            this.node.position.x - this.playerNode.position.x,
            this.node.position.y - this.playerNode.position.y,
            this.node.position.z - this.playerNode.position.z
        )
    }

    update(deltaTime: number) {
        this.node.setPosition(
            new Vec3(
                this.playerNode.position.x + this.offset.x,
                this.node.position.y,
                this.playerNode.position.z + this.offset.z
            )
        )
    }
}

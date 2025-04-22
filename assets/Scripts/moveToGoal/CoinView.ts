import { _decorator, Collider, Component, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('CoinView')
export class CoinView extends Component {
    @property(Collider)
    private collider: Collider
    @property(Node)
    private coinNode: Node
    @property(Node)
    private thornNode: Node

    start() {
        this.collider.on('onTriggerEnter', this.onTrigger, this)
    }

    private onTrigger() {
        this.coinNode.active = false
        if (this.thornNode) this.thornNode.active = true
    }
}

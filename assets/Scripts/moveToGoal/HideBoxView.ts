import { _decorator, CCBoolean, Collider, Component, MeshRenderer, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('HideBox')
export class HideBox extends Component {
    @property(Collider)
    private collider: Collider

    @property(MeshRenderer)
    private meshRenderer: MeshRenderer

    @property(CCBoolean)
    private isHideWhenExit: Boolean = false

    start() {
        if (!this.collider) this.collider.getComponent(Collider)
        if (!this.meshRenderer) this.collider.getComponent(MeshRenderer)

        this.meshRenderer.enabled = false

        this.collider.on('onCollisionEnter', this.showBox, this)
        this.collider.on('onTriggerEnter', this.showBox, this)
        if (this.isHideWhenExit) this.collider.on('onCollisionExit', this.hideBox, this)
    }

    private showBox() {
        this.meshRenderer.enabled = true
    }

    private hideBox() {
        this.meshRenderer.enabled = false
    }
}

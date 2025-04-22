import { _decorator, Collider, Component, Material, MeshRenderer, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('FakeObjectView')
export class FakeObjectView extends Component {
    private collider: Collider
    private meshRenderer: MeshRenderer
    @property(Material)
    private showMaterial: Material
    @property(Material)
    private tranMaterial: Material

    start() {
        this.collider = this.node.getComponent(Collider)
        this.meshRenderer = this.node.getComponent(MeshRenderer)

        this.collider.on('onTriggerEnter', this.onTriggerEnter, this)
        this.collider.on('onTriggerExit', this.onTriggerExit, this)
    }

    private onTriggerEnter() {
        this.meshRenderer.material = this.tranMaterial
    }

    private onTriggerExit() {
        this.meshRenderer.material = this.showMaterial
    }
}

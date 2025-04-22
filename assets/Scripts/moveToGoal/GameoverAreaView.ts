import { _decorator, Collider, Component, director, Node } from 'cc'
import { GameplayPod } from '../Pods/GameplayPod'
import { GameplayState } from '../States/GameplayState'
const { ccclass, property } = _decorator

@ccclass('GameoverArea')
export class GameoverArea extends Component {
    @property(Collider)
    private collider: Collider

    start() {
        this.collider.on('onTriggerEnter', this.checkGameover, this)
        this.collider.on('onCollisionEnter', this.checkGameover, this)
    }

    private checkGameover() {
        GameplayPod.instance.setGameplayState(GameplayState.GameOver)
    }
}

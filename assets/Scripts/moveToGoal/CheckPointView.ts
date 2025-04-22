import { _decorator, CCInteger, Collider, Component, Node } from 'cc'
import { MoveToGoalPod } from './MoveToGoalPod'
import { GameplayPod } from '../Pods/GameplayPod'
import { GameplayState } from '../States/GameplayState'
const { ccclass, property } = _decorator

@ccclass('CheckPoint')
export class CheckPoint extends Component {
    @property(Collider)
    private collider: Collider
    @property(CCInteger)
    private spawnPointIndex: number

    private moveToGoalPod: MoveToGoalPod

    start(): void {
        this.moveToGoalPod = MoveToGoalPod.instance
        // if (this.moveToGoalPod.spawnPointIndex >= this.spawnPointIndex) this.node.active = false
        // this.collider.on('onTriggerEnter', this.setCheckPoint, this)
        this.collider.on('onTriggerEnter', this.clearGame, this)
    }

    private setCheckPoint() {
        this.node.active = false
        this.moveToGoalPod.setSpawnPoint(this.spawnPointIndex)
    }

    private clearGame() {
        this.node.active = false
        GameplayPod.instance.setGameplayState(GameplayState.Result)
    }
}

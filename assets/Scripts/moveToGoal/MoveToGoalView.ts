import { _decorator, Component, Node } from 'cc'
import { GameplayPod } from '../Pods/GameplayPod'
import { MoveToGoalGameOverUIView } from './MoveToGoalGameOverUIView'
import { MoveToGoalPod } from './MoveToGoalPod'
import { MoveToGoalGameClearUIView } from './MoveToGoalGameClearUIView'
const { ccclass, property } = _decorator

@ccclass('MoveToGoalView')
export class MoveToGoalView extends Component {
    @property(MoveToGoalGameOverUIView)
    private moveToGoalGameOverUIView: MoveToGoalGameOverUIView
    @property(MoveToGoalGameClearUIView)
    private moveToGoalGameClearUIView: MoveToGoalGameClearUIView

    @property(Node)
    private spawnPointList: Node[] = []
    @property(Node)
    private player: Node

    private moveToGoalPod: MoveToGoalPod
    private gameplayPod: GameplayPod

    start() {
        this.moveToGoalPod = MoveToGoalPod.instance
        this.gameplayPod = GameplayPod.instance

        this.moveToGoalGameOverUIView.doinit()
        this.moveToGoalGameClearUIView.doinit()

        this.setSpawn()
    }

    private setSpawn() {
        this.player.setPosition(this.spawnPointList[this.moveToGoalPod.spawnPointIndex].position)
    }
}

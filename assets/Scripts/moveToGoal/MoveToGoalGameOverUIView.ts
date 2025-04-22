import { _decorator, Button, Component, director, Node } from 'cc'
import { GameplayPod } from '../Pods/GameplayPod'
import { GameplayState } from '../States/GameplayState'
import { GameplayEventType } from '../Types/EventTypes/GameplayEventType'
const { ccclass, property } = _decorator

@ccclass('MoveToGoalGameOverUIView')
export class MoveToGoalGameOverUIView extends Component {
    private static readonly DELAY_SHOW_UI = 1
    @property(Node)
    private gameoverUINode: Node
    @property(Button)
    private restartButton: Button

    public doinit() {
        GameplayPod.instance.gameplayPodEventTarget.on(GameplayEventType.onGameplayStateChange, (state) => {
            state == GameplayState.GameOver ? this.showUI() : this.hideUI()
        })
        this.restartButton.node.on(Button.EventType.CLICK, this.restartGame, this)
    }

    private showUI() {
        this.schedule(
            () => {
                this.gameoverUINode.active = true
            },
            MoveToGoalGameOverUIView.DELAY_SHOW_UI,
            0
        )
    }

    private hideUI() {
        this.gameoverUINode.active = false
    }

    private restartGame() {
        GameplayPod.instance.gameplayPodEventTarget.off(GameplayEventType.onGameplayStateChange)
        director.loadScene('MovetoGoal_0')
        GameplayPod.instance.setGameplayState(GameplayState.GamePlay)
    }
}

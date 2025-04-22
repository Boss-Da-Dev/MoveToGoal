import { _decorator, Button, Component, director, Node } from 'cc'
import { GameplayEventType } from '../Types/EventTypes/GameplayEventType'
import { GameplayState } from '../States/GameplayState'
import { GameplayPod } from '../Pods/GameplayPod'
const { ccclass, property } = _decorator

@ccclass('MoveToGoalGameClearUIView')
export class MoveToGoalGameClearUIView extends Component {
    private static readonly DELAY_SHOW_UI = 1
    @property(Node)
    private gameclearUINode: Node
    @property(Button)
    private restartButton: Button

    public doinit() {
        GameplayPod.instance.gameplayPodEventTarget.on(GameplayEventType.onGameplayStateChange, (state) => {
            state == GameplayState.Result ? this.showUI() : this.hideUI()
        })
        this.restartButton.node.on(Button.EventType.CLICK, this.restartGame, this)
    }

    private showUI() {
        this.schedule(
            () => {
                this.gameclearUINode.active = true
            },
            MoveToGoalGameClearUIView.DELAY_SHOW_UI,
            0
        )
    }

    private hideUI() {
        this.gameclearUINode.active = false
    }

    private restartGame() {
        GameplayPod.instance.gameplayPodEventTarget.off(GameplayEventType.onGameplayStateChange)
        director.loadScene('MovetoGoal_0')
        GameplayPod.instance.setGameplayState(GameplayState.GamePlay)
    }
}

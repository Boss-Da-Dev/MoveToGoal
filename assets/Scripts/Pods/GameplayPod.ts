import { _decorator, EventTarget } from 'cc'
import { GameplayEventType } from '../Types/EventTypes/GameplayEventType'
import { GameplayState } from '../States/GameplayState'
import { LeaderBoardDataBean } from '../Beans/LeaderBoardDataBean'
const { ccclass } = _decorator

@ccclass('GameplayPod')
export class GameplayPod {
    public gameplayState: GameplayState = GameplayState.GamePlay
    public gameplayPodEventTarget = new EventTarget()

    private static _instance: GameplayPod
    private static getInstance() {
        if (!GameplayPod._instance) {
            GameplayPod._instance = new GameplayPod()
        }
        return GameplayPod._instance
    }

    static get instance(): GameplayPod {
        return this.getInstance()
    }

    public setGameplayState(state: GameplayState) {
        this.gameplayState = state
        this.gameplayPodEventTarget.emit(GameplayEventType.onGameplayStateChange, state)
    }
}

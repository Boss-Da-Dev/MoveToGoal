import { _decorator, Component, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('MoveToGoalPod')
export class MoveToGoalPod {
    private static _instance: MoveToGoalPod
    private static getInstance() {
        if (!MoveToGoalPod._instance) {
            MoveToGoalPod._instance = new MoveToGoalPod()
        }
        return MoveToGoalPod._instance
    }

    static get instance(): MoveToGoalPod {
        return this.getInstance()
    }

    public spawnPointIndex: number = 0

    public setSpawnPoint(spawnIndex: number) {
        this.spawnPointIndex = spawnIndex
    }
}

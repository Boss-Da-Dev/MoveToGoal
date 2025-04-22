import {
    _decorator,
    CapsuleCollider,
    CCBoolean,
    CCFloat,
    Component,
    EventKeyboard,
    geometry,
    Input,
    input,
    KeyCode,
    lerp,
    Node,
    PhysicsSystem,
    RigidBody,
    Vec3,
} from 'cc'
import { GameplayPod } from '../Pods/GameplayPod'
import { GameplayState } from '../States/GameplayState'
import { GameplayEventType } from '../Types/EventTypes/GameplayEventType'
const { ccclass, property } = _decorator

@ccclass('PlayerControllerMove')
export class PlayerControllerMove extends Component {
    @property(CCBoolean)
    private isSideMove: boolean = false

    @property(RigidBody)
    private rb: RigidBody
    @property(CapsuleCollider)
    private collider: CapsuleCollider
    @property(Node)
    private playerModel: Node

    @property(CCFloat)
    private moveSpeed: number
    @property(CCFloat)
    private jumpPower: number

    private isGround: boolean = false

    private moveDirection: Vec3 = new Vec3(0, 0, 0)
    private horizontalInput: number
    private verticalInput: number

    private isKeyAInput: boolean = false
    private isKeyDInput: boolean = false
    private isKeyWInput: boolean = false
    private isKeySInput: boolean = false

    private gameplayPod: GameplayPod
    private isCanMove: Boolean = true

    start() {
        this.gameplayPod = GameplayPod.instance

        this.gameplayPod.gameplayPodEventTarget.on(GameplayEventType.onGameplayStateChange, (state) => {
            if (state == GameplayState.GamePlay) this.isCanMove = true
            else this.isCanMove = false
        })
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this)
    }

    private onKeyDown(event: EventKeyboard) {
        if (event.keyCode == KeyCode.SPACE) {
            this.jump()
            return
        }

        if (event.keyCode == KeyCode.KEY_A) {
            this.isKeyAInput = true
            if (this.isSideMove) this.verticalInput = -1
            else this.horizontalInput = 1
        } else if (event.keyCode == KeyCode.KEY_D) {
            this.isKeyDInput = true
            if (this.isSideMove) this.verticalInput = 1
            else this.horizontalInput = -1
        }

        if (event.keyCode == KeyCode.KEY_W) {
            this.isKeyWInput = true
            if (this.isSideMove) this.horizontalInput = 1
            else this.verticalInput = 1
        } else if (event.keyCode == KeyCode.KEY_S) {
            this.isKeySInput = true
            if (this.isSideMove) this.horizontalInput = -1
            else this.verticalInput = -1
        }

        this.rotateModel()
    }

    private onKeyUp(event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_A) {
            this.isKeyAInput = false
            if (!this.isKeyDInput) {
                if (this.isSideMove) this.verticalInput = 0
                else this.horizontalInput = 0
            }
        } else if (event.keyCode == KeyCode.KEY_D) {
            this.isKeyDInput = false
            if (!this.isKeyAInput) {
                if (this.isSideMove) this.verticalInput = 0
                else this.horizontalInput = 0
            }
        }

        if (event.keyCode == KeyCode.KEY_W) {
            this.isKeyWInput = false
            if (!this.isKeySInput) {
                if (this.isSideMove) this.horizontalInput = 0
                else this.verticalInput = 0
            }
        } else if (event.keyCode == KeyCode.KEY_S) {
            this.isKeySInput = false
            if (!this.isKeyWInput) {
                if (this.isSideMove) this.horizontalInput = 0
                else this.verticalInput = 0
            }
        }

        if (Math.abs(this.verticalInput) + Math.abs(this.horizontalInput) != 0) this.rotateModel()
    }

    private rotateModel() {
        if (!this.isCanMove) return

        let faceDirection = new Vec3(-this.horizontalInput, 0, -this.verticalInput)
        faceDirection = faceDirection.normalize()
        if (faceDirection != Vec3.ZERO) {
            this.playerModel.forward = faceDirection
        }
    }

    private movement(deltaTime: number) {
        if (!this.isCanMove) {
            this.horizontalInput = 0
            this.verticalInput = 0
            return
        }

        this.checkGround()
        if (!this.isSideMove) {
            if (
                (this.checkRaycastDirection(DirectionType.Left) && this.isKeyAInput) ||
                (this.checkRaycastDirection(DirectionType.Right) && this.isKeyDInput)
            )
                this.horizontalInput = 0
            if (
                (this.checkRaycastDirection(DirectionType.Front) && this.isKeyWInput) ||
                (this.checkRaycastDirection(DirectionType.Back) && this.isKeySInput)
            )
                this.verticalInput = 0
        } else {
            if (
                (this.checkRaycastDirection(DirectionType.Back) && this.isKeyAInput) ||
                (this.checkRaycastDirection(DirectionType.Front) && this.isKeyDInput)
            )
                this.verticalInput = 0
            if (
                (this.checkRaycastDirection(DirectionType.Left) && this.isKeyWInput) ||
                (this.checkRaycastDirection(DirectionType.Right) && this.isKeySInput)
            )
                this.horizontalInput = 0
        }

        this.moveDirection = new Vec3(this.horizontalInput, 0, this.verticalInput)
        this.moveDirection = this.moveDirection.normalize()

        this.node.translate(
            new Vec3(
                this.moveDirection.x * this.moveSpeed * deltaTime,
                0,
                this.moveDirection.z * this.moveSpeed * deltaTime
            )
        )
    }

    private checkRaycastDirection(directionType: DirectionType): boolean {
        let ray = new geometry.Ray()
        switch (directionType) {
            case DirectionType.Left:
                geometry.Ray.fromPoints(
                    ray,
                    this.node.position,
                    new Vec3(this.node.position.x + this.collider.radius, this.node.position.y, this.node.position.z)
                )
                break
            case DirectionType.Right:
                geometry.Ray.fromPoints(
                    ray,
                    this.node.position,
                    new Vec3(this.node.position.x - this.collider.radius, this.node.position.y, this.node.position.z)
                )
                break
            case DirectionType.Front:
                geometry.Ray.fromPoints(
                    ray,
                    this.node.position,
                    new Vec3(this.node.position.x, this.node.position.y, this.node.position.z + this.collider.radius)
                )
                break
            case DirectionType.Back:
                geometry.Ray.fromPoints(
                    ray,
                    this.node.position,
                    new Vec3(this.node.position.x, this.node.position.y, this.node.position.z - this.collider.radius)
                )
                break
        }

        const mask = 0xffffffff
        const maxDistance = this.collider.radius * 1.7
        const queryTrigger = true

        if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult
            let collider = raycastClosestResult.collider
            if (collider.isTrigger) return false
            return true
        }
        return false
    }

    private checkGround() {
        let ray = new geometry.Ray()
        geometry.Ray.fromPoints(
            ray,
            this.node.position,
            new Vec3(this.node.position.x, this.node.position.y - this.collider.height, this.node.position.z)
        )
        const mask = 0xffffffff
        const maxDistance = this.collider.height / 2 + 0.2
        const queryTrigger = true
        let collider

        if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult
            collider = raycastClosestResult.collider
            collider = !collider.isTrigger
        }
        this.isGround = !!collider
    }

    private jump() {
        if (this.isGround && this.isCanMove) {
            this.rb.applyForce(new Vec3(0, this.jumpPower * 1000, 0))
            // this.scheduleOnce(() => {
            //     if (!this.isGround) this.rb.applyForce(new Vec3(0, this.jumpPower * -500, 0))
            // }, 0.8)
        }
    }

    update(deltaTime: number) {
        this.movement(deltaTime)
    }
}

export enum DirectionType {
    Left,
    Right,
    Front,
    Back,
}

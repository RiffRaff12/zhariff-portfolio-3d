import { useRef, useEffect, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import { applyCollision } from '../../../utils/physics'
import { SCENE_CONFIG } from '../../../config/scene.config'
import { useInputBus } from '../../../context/InputBusContext'

const MOVE_SPEED = 4.5
const EYE_HEIGHT = 1.7
const HEAD_BOB_SPEED = 8
const HEAD_BOB_AMOUNT = 0.045
const MOBILE_LOOK_SPEED = 0.0028

// Pre-allocated to avoid per-frame allocations
const _fwd   = new THREE.Vector3()
const _right = new THREE.Vector3()
const _up    = new THREE.Vector3(0, 1, 0)
const _move  = new THREE.Vector3()
const _disp  = new THREE.Vector3()

export function FirstPersonController({ isActive, onLockChange, inputRef }) {
  const { camera, gl } = useThree()
  const controlsRef = useRef()
  const keys = useRef({})
  const bobTime = useRef(0)
  const bobActive = useRef(false)
  const velocityRef = useRef(new THREE.Vector3())
  const isLockedRef = useRef(false)

  // Mobile look: euler accumulates yaw/pitch from touch drag events
  const mobileEuler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))

  // Always call useRef — inputRef prop takes precedence via nullish coalesce
  const fallbackInputRef = useRef({ positionDelta: null })
  const mobileInput = inputRef ?? fallbackInputRef

  const inputBus = useInputBus()

  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, 1.5)
  }, [camera])

  // WASD keyboard input
  useEffect(() => {
    if (!isActive) return
    const down = (e) => { keys.current[e.code] = true }
    const up   = (e) => { keys.current[e.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup',   up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup',   up)
    }
  }, [isActive])

  // Mobile look — accumulate rotation from InputBus look events
  inputBus?.useLook((dx, dy) => {
    mobileEuler.current.y -= dx * MOBILE_LOOK_SPEED
    mobileEuler.current.x = THREE.MathUtils.clamp(
      mobileEuler.current.x - dy * MOBILE_LOOK_SPEED,
      -Math.PI / 4,
      Math.PI / 4
    )
  })

  const handleLock   = useCallback(() => { isLockedRef.current = true;  onLockChange?.(true)  }, [onLockChange])
  const handleUnlock = useCallback(() => { isLockedRef.current = false; onLockChange?.(false) }, [onLockChange])

  useFrame((_, delta) => {
    if (!isActive) return
    const dt = Math.min(delta, 0.05)

    // Camera look: apply mobile euler when pointer is NOT locked
    // (PointerLockControls owns rotation when locked — don't interfere)
    if (!isLockedRef.current) {
      camera.quaternion.setFromEuler(mobileEuler.current)
    }

    // Derive movement axes from camera's current horizontal orientation
    camera.getWorldDirection(_fwd)
    _fwd.y = 0
    _fwd.normalize()
    _right.crossVectors(_fwd, _up).normalize()

    _move.set(0, 0, 0)
    const k   = keys.current
    const mob = mobileInput.current?.positionDelta

    if (k['KeyW'] || k['ArrowUp'])    _move.addScaledVector(_fwd,    1)
    if (k['KeyS'] || k['ArrowDown'])  _move.addScaledVector(_fwd,   -1)
    if (k['KeyA'] || k['ArrowLeft'])  _move.addScaledVector(_right, -1)
    if (k['KeyD'] || k['ArrowRight']) _move.addScaledVector(_right,  1)

    // Mobile joystick: x = strafe, z = forward/back
    if (mob && mob.length() > 0.01) {
      _move.addScaledVector(_fwd,  -mob.z)
      _move.addScaledVector(_right, mob.x)
    }

    const isMoving = _move.length() > 0.01
    if (isMoving) _move.normalize()

    // Smooth velocity with exponential lerp
    velocityRef.current.lerp(_move.clone().multiplyScalar(MOVE_SPEED), Math.min(1, dt * 10))

    _disp.copy(velocityRef.current).multiplyScalar(dt)
    const raw = {
      x: camera.position.x + _disp.x,
      z: camera.position.z + _disp.z,
    }
    const { x: nx, z: nz } = applyCollision(raw.x, raw.z, SCENE_CONFIG.colliders, SCENE_CONFIG.bounds)

    // Head bob
    if (isMoving) {
      bobTime.current += dt * HEAD_BOB_SPEED
      bobActive.current = true
    } else {
      bobActive.current = false
    }
    const bob = bobActive.current ? Math.sin(bobTime.current) * HEAD_BOB_AMOUNT : 0

    camera.position.set(nx, EYE_HEIGHT + bob, nz)
  })

  if (!isActive) return null

  return (
    <PointerLockControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      maxPolarAngle={Math.PI / 2 + Math.PI / 4}
      minPolarAngle={Math.PI / 2 - Math.PI / 4}
      onLock={handleLock}
      onUnlock={handleUnlock}
    />
  )
}

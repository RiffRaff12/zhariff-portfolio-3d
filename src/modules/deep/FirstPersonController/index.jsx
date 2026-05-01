import { useRef, useEffect, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'

const MOVE_SPEED = 4.5
const EYE_HEIGHT = 1.7
const HEAD_BOB_SPEED = 8
const HEAD_BOB_AMOUNT = 0.045

// Room AABB (camera stays inside these X/Z bounds)
const ROOM_BOUNDS = { minX: -4.0, maxX: 4.0, minZ: -3.0, maxZ: 3.0 }

// Cylindrical obstacle colliders: [cx, cz, radius]
const COLLIDERS = [
  [2.8, -2.2, 0.9],   // desk
  [-2.8, -1.8, 1.0],  // bed
  [-3.6,  0.5, 0.5],  // bookshelf
]

function applyCollision(x, z) {
  let nx = Math.max(ROOM_BOUNDS.minX, Math.min(ROOM_BOUNDS.maxX, x))
  let nz = Math.max(ROOM_BOUNDS.minZ, Math.min(ROOM_BOUNDS.maxZ, z))
  for (const [cx, cz, r] of COLLIDERS) {
    const dx = nx - cx
    const dz = nz - cz
    const dist = Math.sqrt(dx * dx + dz * dz)
    if (dist < r && dist > 0.001) {
      const scale = r / dist
      nx = cx + dx * scale
      nz = cz + dz * scale
    }
  }
  return [nx, nz]
}

export function FirstPersonController({ isActive, onLockChange, inputRef }) {
  const { camera, gl } = useThree()
  const controlsRef = useRef()
  const keys = useRef({})
  const bobTime = useRef(0)
  const bobActive = useRef(false)
  const velocityRef = useRef(new THREE.Vector3())

  // Always call useRef — inputRef prop takes precedence
  const fallbackInputRef = useRef({ positionDelta: null })
  const mobileInput = inputRef ?? fallbackInputRef

  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, 1.5)
  }, [camera])

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

  const handleLock   = useCallback(() => onLockChange?.(true),  [onLockChange])
  const handleUnlock = useCallback(() => onLockChange?.(false), [onLockChange])

  useFrame((_, delta) => {
    if (!isActive) return
    const dt = Math.min(delta, 0.05)

    const fwd = new THREE.Vector3()
    camera.getWorldDirection(fwd)
    fwd.y = 0
    fwd.normalize()
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize()

    const move = new THREE.Vector3()
    const k    = keys.current
    const mob  = mobileInput.current?.positionDelta

    if (k['KeyW'] || k['ArrowUp'])    move.addScaledVector(fwd,   1)
    if (k['KeyS'] || k['ArrowDown'])  move.addScaledVector(fwd,  -1)
    if (k['KeyA'] || k['ArrowLeft'])  move.addScaledVector(right, -1)
    if (k['KeyD'] || k['ArrowRight']) move.addScaledVector(right,  1)

    if (mob && mob.length() > 0.01) {
      move.addScaledVector(fwd,   -mob.z)
      move.addScaledVector(right,  mob.x)
    }

    const isMoving = move.length() > 0.01
    if (isMoving) move.normalize()

    velocityRef.current.lerp(move.clone().multiplyScalar(MOVE_SPEED), Math.min(1, dt * 10))

    const disp = velocityRef.current.clone().multiplyScalar(dt)
    let nx = camera.position.x + disp.x
    let nz = camera.position.z + disp.z;
    [nx, nz] = applyCollision(nx, nz)

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

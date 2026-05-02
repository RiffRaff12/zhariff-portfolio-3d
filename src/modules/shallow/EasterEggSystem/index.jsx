import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useProximity } from '../../../context/ProximityContext'
import { EASTER_EGGS } from '../../../data/easterEggs'

// Pre-allocated to avoid per-frame allocations
const _scaleTarget = new THREE.Vector3()

// World positions for each Easter egg object
const EGG_POSITIONS = {
  'quran':           [-3.5, 0.78, 0.1],
  'chem-textbook':   [-3.5, 1.42, 0.5],
  'petronas-towers': [2.8, 0.85, -1.75],
  'hifz-laptop':     [2.8, 0.81, -2.3],
  'property-listing':[2.6, 1.0, -1.9],
  'bp-mug':          [2.9, 0.82, -1.95],
  'fulcrum-object':  [-3.5, 1.1, -0.4],
  'hidden-spider':   [3.8, 3.3, -3.2],
  'running-trainers':[-1.0, 0.08, 2.8],
}

const EGG_RADII = {
  'hidden-spider': 2.5,
}
const DEFAULT_RADIUS = 1.6

function EasterEggObject({ egg }) {
  const { id, color, accentColor } = egg
  const meshRef = useRef()
  const { register, unregister, highlightedId } = useProximity()
  const pos = EGG_POSITIONS[id]
  const isHighlighted = highlightedId === `egg-${id}`

  const position = useMemo(() => new THREE.Vector3(...(pos ?? [0, 0, 0])), [pos])

  useEffect(() => {
    if (!pos) return
    return register(`egg-${id}`, position, EGG_RADII[id] ?? DEFAULT_RADIUS)
  }, [id, position, register])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    // Scale highlight pulse — reuse pre-allocated vector
    const s = isHighlighted ? 1.15 : 1.0
    _scaleTarget.set(s, s, s)
    meshRef.current.scale.lerp(_scaleTarget, delta * 8)

    // Float in local space — group is already at world pos, so y=0 is baseline
    meshRef.current.position.y = Math.sin(Date.now() * 0.002 + id.charCodeAt(0)) * 0.025
  })

  if (!pos) return null

  return (
    <group position={pos}>
      <mesh ref={meshRef} castShadow>
        {id === 'bp-mug' || id === 'petronas-towers' ? (
          <cylinderGeometry args={[0.055, 0.045, 0.12, 8]} />
        ) : id === 'hidden-spider' ? (
          <sphereGeometry args={[0.04, 6, 6]} />
        ) : id === 'running-trainers' ? (
          <boxGeometry args={[0.28, 0.1, 0.12]} />
        ) : (
          <boxGeometry args={[0.1, 0.14, 0.03]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={isHighlighted ? accentColor : '#000000'}
          emissiveIntensity={isHighlighted ? 0.4 : 0}
        />
      </mesh>
    </group>
  )
}

export function EasterEggSystem() {
  const { highlightedId } = useProximity()
  const activeEgg = EASTER_EGGS.find(e => highlightedId === `egg-${e.id}`)

  return (
    <>
      {EASTER_EGGS.map(egg => (
        <EasterEggObject key={egg.id} egg={egg} />
      ))}

      {/* Tooltip rendered as DOM overlay (not 3D) — managed by NavigationHUD */}
      {/* We pass the active egg data up via context reading in NavigationHUD */}
    </>
  )
}

// Hook for reading active Easter egg in HUD
export function useActiveEasterEgg() {
  const { highlightedId } = useProximity()
  return EASTER_EGGS.find(e => highlightedId === `egg-${e.id}`) ?? null
}

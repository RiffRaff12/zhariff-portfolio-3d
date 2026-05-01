import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useProximity } from '../../../context/ProximityContext'
import { useOverlay } from '../../../context/OverlayContext'

const INSTALLATION_ID = 'side-quests'

export function SideQuestsInstallation({ position, rotation, interactionRadius = 2.0 }) {
  const meshRef = useRef()
  const { register, highlightedId, subscribeToInteraction } = useProximity()
  const { openOverlay } = useOverlay()
  const isHighlighted = highlightedId === INSTALLATION_ID

  const posVec = useMemo(() => new THREE.Vector3(...position), [position])

  useEffect(() => {
    return register(INSTALLATION_ID, posVec, interactionRadius)
  }, [posVec, interactionRadius, register])

  useEffect(() => {
    return subscribeToInteraction((triggeredId) => {
      if (triggeredId === INSTALLATION_ID) openOverlay({ type: 'side-quests' })
    })
  }, [subscribeToInteraction, openOverlay])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      meshRef.current.material.emissiveIntensity,
      isHighlighted ? 0.4 : 0.06,
      delta * 6
    )
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Shelf-mounted display */}
      <mesh castShadow>
        <boxGeometry args={[1.1, 1.2, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>
      <mesh ref={meshRef} position={[0, 0.45, 0.04]}>
        <boxGeometry args={[1.05, 0.26, 0.01]} />
        <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={0.06} />
      </mesh>
      <mesh position={[0, -0.1, 0.04]}>
        <boxGeometry args={[1.05, 0.85, 0.01]} />
        <meshStandardMaterial color="#0d1117" />
      </mesh>
      {/* Screen lines mimicking a UI */}
      {[-0.25, -0.1, 0.05, 0.2].map((y, i) => (
        <mesh key={i} position={[0, y, 0.05]}>
          <boxGeometry args={[0.8, 0.02, 0.001]} />
          <meshStandardMaterial color="#4da6ff" transparent opacity={0.5} />
        </mesh>
      ))}
      {isHighlighted && (
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.2, 1.3, 0.01]} />
          <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={1.0} transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  )
}

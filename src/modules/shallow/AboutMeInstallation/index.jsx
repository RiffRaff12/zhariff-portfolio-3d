import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useProximity } from '../../../context/ProximityContext'
import { useOverlay } from '../../../context/OverlayContext'

const INSTALLATION_ID = 'about-me'

export function AboutMeInstallation({ position, rotation, interactionRadius = 2.0 }) {
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
      if (triggeredId === INSTALLATION_ID) openOverlay({ type: 'about-me' })
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
      {/* Cork board */}
      <mesh castShadow>
        <boxGeometry args={[1.1, 1.4, 0.05]} />
        <meshStandardMaterial color="#5a3e2b" roughness={0.95} />
      </mesh>
      {/* Header strip */}
      <mesh ref={meshRef} position={[0, 0.55, 0.04]}>
        <boxGeometry args={[1.05, 0.22, 0.01]} />
        <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={0.06} />
      </mesh>
      {/* Content area */}
      <mesh position={[0, -0.1, 0.04]}>
        <boxGeometry args={[1.05, 0.95, 0.01]} />
        <meshStandardMaterial color="#fffef5" />
      </mesh>
      {isHighlighted && (
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.18, 1.5, 0.01]} />
          <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={1.0} transparent opacity={0.45} />
        </mesh>
      )}
    </group>
  )
}

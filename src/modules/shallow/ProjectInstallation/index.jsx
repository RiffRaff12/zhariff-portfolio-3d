import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useProximity } from '../../../context/ProximityContext'
import { useOverlay } from '../../../context/OverlayContext'

// 3D poster on wall — opens overlay via context (no DOM rendering inside Canvas)
export function ProjectInstallation({ project, position, rotation, interactionRadius = 2.0 }) {
  const { id, color } = project
  const meshRef = useRef()
  const { register, highlightedId, subscribeToInteraction } = useProximity()
  const { openOverlay } = useOverlay()
  const isHighlighted = highlightedId === id

  const posVec = useMemo(() => new THREE.Vector3(...position), [position])

  useEffect(() => {
    return register(id, posVec, interactionRadius)
  }, [id, posVec, interactionRadius, register])

  useEffect(() => {
    return subscribeToInteraction((triggeredId) => {
      if (triggeredId === id) openOverlay({ type: 'project', id })
    })
  }, [id, subscribeToInteraction, openOverlay])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const targetEmissive = isHighlighted ? 0.45 : 0.05
    meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      meshRef.current.material.emissiveIntensity,
      targetEmissive,
      delta * 6
    )
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Backing board */}
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.8, 0.04]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>
      {/* Coloured header strip */}
      <mesh ref={meshRef} position={[0, 0.28, 0.03]}>
        <boxGeometry args={[1.05, 0.22, 0.01]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.05} />
      </mesh>
      {/* Label area */}
      <mesh position={[0, -0.05, 0.03]}>
        <boxGeometry args={[1.05, 0.52, 0.01]} />
        <meshStandardMaterial color="#f8f9fa" />
      </mesh>
      {/* Highlight glow border */}
      {isHighlighted && (
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.18, 0.88, 0.01]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  )
}

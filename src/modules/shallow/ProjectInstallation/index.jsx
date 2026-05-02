import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useProximity } from '../../../context/ProximityContext'
import { useOverlay } from '../../../context/OverlayContext'

// 3D poster on wall — opens overlay via context (no DOM rendering inside Canvas)
export function ProjectInstallation({ project, position, rotation, interactionRadius = 2.0 }) {
  const { id, color, installationLabel, title } = project
  const headerRef = useRef()
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
    if (!headerRef.current) return
    const targetEmissive = isHighlighted ? 0.55 : 0.05
    headerRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      headerRef.current.material.emissiveIntensity,
      targetEmissive,
      delta * 6
    )
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Backing board */}
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.88, 0.04]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>

      {/* Coloured header strip with label */}
      <mesh ref={headerRef} position={[0, 0.32, 0.03]}>
        <boxGeometry args={[1.05, 0.22, 0.01]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.05} />
      </mesh>
      <Text
        position={[0, 0.32, 0.045]}
        fontSize={0.075}
        color="#0d0d0d"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.18}
        font={undefined}
      >
        {installationLabel}
      </Text>

      {/* White content area with title text */}
      <mesh position={[0, -0.06, 0.03]}>
        <boxGeometry args={[1.05, 0.58, 0.01]} />
        <meshStandardMaterial color="#f8f9fa" />
      </mesh>
      <Text
        position={[0, 0.02, 0.045]}
        fontSize={0.082}
        color="#0d0d0d"
        maxWidth={0.9}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        font={undefined}
        overflowWrap="break-word"
      >
        {title}
      </Text>
      <Text
        position={[0, -0.22, 0.045]}
        fontSize={0.055}
        color="#666"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
        font={undefined}
      >
        [ Press E to view ]
      </Text>

      {/* Highlight glow border */}
      {isHighlighted && (
        <mesh position={[0, 0, -0.015]}>
          <boxGeometry args={[1.22, 0.96, 0.01]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  )
}

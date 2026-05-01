import { useMemo } from 'react'
import * as THREE from 'three'

const ROOM_W = 9   // X total width
const ROOM_H = 3.5 // Y total height
const ROOM_D = 7   // Z total depth
const WALL_T = 0.2

// Comic-palette toon material factory
function useToonMat(color) {
  return useMemo(() => {
    const data = new Uint8Array([48, 112, 176, 255])
    const gradientMap = new THREE.DataTexture(data, 4, 1, THREE.RedFormat)
    gradientMap.needsUpdate = true
    return new THREE.MeshToonMaterial({ color, gradientMap })
  }, [color])
}

export function RoomGeometry() {
  const floorMat = useToonMat('#1a1209')
  const ceilMat = useToonMat('#0d0d1a')
  const wallBackMat = useToonMat('#0e1520')
  const wallSideMat = useToonMat('#111827')

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <primitive object={floorMat} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_H, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <primitive object={ceilMat} />
      </mesh>

      {/* Back wall (negative Z) */}
      <mesh position={[0, ROOM_H / 2, -ROOM_D / 2]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_H]} />
        <primitive object={wallBackMat} />
      </mesh>

      {/* Front wall (positive Z) - behind camera spawn */}
      <mesh position={[0, ROOM_H / 2, ROOM_D / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_H]} />
        <primitive object={wallBackMat} />
      </mesh>

      {/* Left wall (negative X) */}
      <mesh position={[-ROOM_W / 2, ROOM_H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <primitive object={wallSideMat} />
      </mesh>

      {/* Right wall (positive X) */}
      <mesh position={[ROOM_W / 2, ROOM_H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <primitive object={wallSideMat} />
      </mesh>

      {/* Skirting boards (comic visual grounding) */}
      {[
        { pos: [0, 0.06, -ROOM_D / 2 + 0.01], rot: [0, 0, 0], w: ROOM_W },
        { pos: [0, 0.06, ROOM_D / 2 - 0.01], rot: [0, Math.PI, 0], w: ROOM_W },
        { pos: [-ROOM_W / 2 + 0.01, 0.06, 0], rot: [0, Math.PI / 2, 0], w: ROOM_D },
        { pos: [ROOM_W / 2 - 0.01, 0.06, 0], rot: [0, -Math.PI / 2, 0], w: ROOM_D },
      ].map(({ pos, rot, w }, i) => (
        <mesh key={i} position={pos} rotation={rot}>
          <planeGeometry args={[w, 0.12]} />
          <meshStandardMaterial color="#080808" />
        </mesh>
      ))}
    </group>
  )
}

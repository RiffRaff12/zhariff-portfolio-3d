import { useMemo } from 'react'
import * as THREE from 'three'

// Shared toon gradient map — 4-step quantisation
function useToonGradient() {
  return useMemo(() => {
    const data = new Uint8Array([64, 128, 192, 255])
    const tex = new THREE.DataTexture(data, 4, 1, THREE.RedFormat)
    tex.needsUpdate = true
    return tex
  }, [])
}

function ToonBox({ position, scale, color, rotation }) {
  const gradientMap = useToonGradient()
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshToonMaterial color={color} gradientMap={gradientMap} />
    </mesh>
  )
}

function ToonCylinder({ position, args, color }) {
  const gradientMap = useToonGradient()
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={args} />
      <meshToonMaterial color={color} gradientMap={gradientMap} />
    </mesh>
  )
}

// Bed — against back-left wall
export function Bed() {
  const gradient = useToonGradient()
  return (
    <group position={[-2.8, 0, -2.2]}>
      {/* Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.25, 3.2]} />
        <meshToonMaterial color="#2a1a1a" gradientMap={gradient} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[1.85, 0.3, 3.0]} />
        <meshToonMaterial color="#c1121f" gradientMap={gradient} />
      </mesh>
      {/* Pillow */}
      <mesh position={[0, 0.5, -1.2]} castShadow>
        <boxGeometry args={[1.5, 0.18, 0.55]} />
        <meshToonMaterial color="#f8f9fa" gradientMap={gradient} />
      </mesh>
      {/* Headboard */}
      <mesh position={[0, 0.7, -1.65]} castShadow>
        <boxGeometry args={[2.1, 1.2, 0.12]} />
        <meshToonMaterial color="#1a0a0a" gradientMap={gradient} />
      </mesh>
      {/* Bed legs */}
      {[[-0.85, -0.12, -1.4], [0.85, -0.12, -1.4], [-0.85, -0.12, 1.4], [0.85, -0.12, 1.4]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.1, 0.12, 0.1]} />
          <meshToonMaterial color="#111" gradientMap={gradient} />
        </mesh>
      ))}
      {/* Duvet */}
      <mesh position={[0, 0.46, 0.6]} castShadow>
        <boxGeometry args={[1.85, 0.22, 1.8]} />
        <meshToonMaterial color="#0a1628" gradientMap={gradient} />
      </mesh>
    </group>
  )
}

// Desk — back-right corner
export function Desk() {
  const gradient = useToonGradient()
  return (
    <group position={[2.8, 0, -2.2]}>
      {/* Desktop surface */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.06, 0.9]} />
        <meshToonMaterial color="#1c1c1c" gradientMap={gradient} />
      </mesh>
      {/* Legs */}
      {[[-0.9, 0.35, 0.38], [0.9, 0.35, 0.38], [-0.9, 0.35, -0.38], [0.9, 0.35, -0.38]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.06, 0.72, 0.06]} />
          <meshToonMaterial color="#111" gradientMap={gradient} />
        </mesh>
      ))}
      {/* Monitor */}
      <mesh position={[0, 1.35, -0.3]} castShadow>
        <boxGeometry args={[1.1, 0.62, 0.06]} />
        <meshToonMaterial color="#0d0d0d" gradientMap={gradient} />
      </mesh>
      {/* Monitor screen — emissive */}
      <mesh position={[0, 1.35, -0.27]}>
        <boxGeometry args={[1.0, 0.55, 0.01]} />
        <meshStandardMaterial color="#0a1628" emissive="#4da6ff" emissiveIntensity={0.6} />
      </mesh>
      {/* Monitor stand */}
      <mesh position={[0, 1.0, -0.3]} castShadow>
        <boxGeometry args={[0.08, 0.56, 0.08]} />
        <meshToonMaterial color="#111" gradientMap={gradient} />
      </mesh>
      {/* Monitor base */}
      <mesh position={[0, 0.79, -0.3]} castShadow>
        <boxGeometry args={[0.4, 0.04, 0.25]} />
        <meshToonMaterial color="#111" gradientMap={gradient} />
      </mesh>
      {/* Keyboard */}
      <mesh position={[0, 0.79, 0.1]} castShadow>
        <boxGeometry args={[0.8, 0.025, 0.28]} />
        <meshToonMaterial color="#222" gradientMap={gradient} />
      </mesh>
      {/* Mouse */}
      <mesh position={[0.55, 0.785, 0.1]} castShadow>
        <boxGeometry args={[0.1, 0.025, 0.16]} />
        <meshToonMaterial color="#333" gradientMap={gradient} />
      </mesh>
    </group>
  )
}

// Chair — at desk
export function DeskChair() {
  const gradient = useToonGradient()
  return (
    <group position={[2.8, 0, -1.2]}>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.52, 0.08, 0.52]} />
        <meshToonMaterial color="#1a1a2e" gradientMap={gradient} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.88, -0.22]} castShadow>
        <boxGeometry args={[0.5, 0.72, 0.07]} />
        <meshToonMaterial color="#1a1a2e" gradientMap={gradient} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshToonMaterial color="#555" gradientMap={gradient} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.05, 5]} />
        <meshToonMaterial color="#333" gradientMap={gradient} />
      </mesh>
      {/* Armrests */}
      {[[-0.3, 0.65, -0.05], [0.3, 0.65, -0.05]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.4]} />
          <meshToonMaterial color="#1a1a2e" gradientMap={gradient} />
        </mesh>
      ))}
    </group>
  )
}

// Bookshelf — left wall
export function Bookshelf() {
  const gradient = useToonGradient()
  const bookColors = ['#e63946', '#4da6ff', '#ffd166', '#00b894', '#a855f7', '#ff6b35', '#e63946']
  return (
    <group position={[-3.75, 0, 0.5]}>
      {/* Frame sides */}
      <mesh position={[-0.48, 1.0, 0]} castShadow>
        <boxGeometry args={[0.06, 2.0, 0.45]} />
        <meshToonMaterial color="#2a1a0a" gradientMap={gradient} />
      </mesh>
      <mesh position={[0.48, 1.0, 0]} castShadow>
        <boxGeometry args={[0.06, 2.0, 0.45]} />
        <meshToonMaterial color="#2a1a0a" gradientMap={gradient} />
      </mesh>
      {/* Shelves */}
      {[0.0, 0.7, 1.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <boxGeometry args={[0.96, 0.05, 0.45]} />
          <meshToonMaterial color="#2a1a0a" gradientMap={gradient} />
        </mesh>
      ))}
      {/* Top panel */}
      <mesh position={[0, 2.02, 0]} castShadow>
        <boxGeometry args={[1.0, 0.05, 0.47]} />
        <meshToonMaterial color="#2a1a0a" gradientMap={gradient} />
      </mesh>
      {/* Books — bottom shelf */}
      {bookColors.slice(0, 4).map((c, i) => (
        <mesh key={`b0-${i}`} position={[-0.3 + i * 0.18, 0.2, 0]} castShadow>
          <boxGeometry args={[0.12, 0.35, 0.38]} />
          <meshToonMaterial color={c} gradientMap={gradient} />
        </mesh>
      ))}
      {/* Books — mid shelf */}
      {bookColors.slice(2, 7).map((c, i) => (
        <mesh key={`b1-${i}`} position={[-0.35 + i * 0.16, 0.9, 0]} castShadow>
          <boxGeometry args={[0.1, 0.42, 0.38]} />
          <meshToonMaterial color={c} gradientMap={gradient} />
        </mesh>
      ))}
    </group>
  )
}

// Floor lamp — near desk
export function FloorLamp() {
  const gradient = useToonGradient()
  return (
    <group position={[3.4, 0, -1.0]}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.06, 12]} />
        <meshToonMaterial color="#222" gradientMap={gradient} />
      </mesh>
      <mesh position={[0, 0.92, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.78, 8]} />
        <meshToonMaterial color="#555" gradientMap={gradient} />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.12, 0.3, 12, 1, true]} />
        <meshToonMaterial color="#ffe9b0" side={THREE.DoubleSide} gradientMap={gradient} />
      </mesh>
      {/* Bulb glow */}
      <mesh position={[0, 1.82, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial emissive="#ffd166" emissiveIntensity={2} color="#fff" />
      </mesh>
    </group>
  )
}

// Window — right wall
export function Window() {
  const gradient = useToonGradient()
  return (
    <group position={[4.3, 2.0, 0]}>
      {/* Frame outer */}
      <mesh rotation={[0, -Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.6, 1.8, 0.1]} />
        <meshToonMaterial color="#2a1a0a" gradientMap={gradient} />
      </mesh>
      {/* Glass pane — emissive "moonlight" */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[0, 0, 0.01]}>
        <planeGeometry args={[1.4, 1.6]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive="#b8d4f0"
          emissiveIntensity={0.35}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Cross bar */}
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[1.5, 0.06, 0.06]} />
        <meshToonMaterial color="#2a1a0a" gradientMap={gradient} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[0.06, 1.7, 0.06]} />
        <meshToonMaterial color="#2a1a0a" gradientMap={gradient} />
      </mesh>
    </group>
  )
}

// Rug — center floor
export function Rug() {
  return (
    <mesh position={[0, 0.005, 0]} receiveShadow>
      <boxGeometry args={[3.5, 0.01, 2.5]} />
      <meshStandardMaterial color="#0a1628" roughness={1} />
    </mesh>
  )
}

// Pinboard — on wall near desk (for case study installations)
export function Pinboard({ position = [3.9, 2.0, -2.0] }) {
  return (
    <group position={position} rotation={[0, -Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.4, 1.0, 0.05]} />
        <meshStandardMaterial color="#5a3e2b" roughness={0.9} />
      </mesh>
    </group>
  )
}

// Nightstand — beside bed
export function Nightstand() {
  const gradient = useToonGradient()
  return (
    <group position={[-1.6, 0, -2.8]}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.5]} />
        <meshToonMaterial color="#2a1a0a" gradientMap={gradient} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.52, 0.04, 0.52]} />
        <meshToonMaterial color="#1c1c1c" gradientMap={gradient} />
      </mesh>
    </group>
  )
}

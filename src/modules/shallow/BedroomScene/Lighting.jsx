import { useRef } from 'react'

export function BedroomLighting() {
  return (
    <>
      {/* Ambient — low, blue-tinted for night feel */}
      <ambientLight intensity={0.25} color="#1a2a4a" />

      {/* Main window light — moonlight / cool blue */}
      <directionalLight
        position={[3.5, 3, -2.5]}
        intensity={1.2}
        color="#b8d4f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {/* Desk lamp — warm point light */}
      <pointLight position={[2.8, 1.9, -1.8]} intensity={2.0} color="#ffd166" distance={4} decay={2} castShadow />

      {/* Monitor glow — electric blue fill */}
      <pointLight position={[2.6, 1.6, -2.4]} intensity={1.0} color="#4da6ff" distance={2.5} decay={2} />

      {/* Under-bed atmosphere — deep red accent */}
      <pointLight position={[-2.8, 0.1, -1.8]} intensity={0.4} color="#e63946" distance={2} decay={2} />

      {/* Bookshelf reading light */}
      <pointLight position={[-3.5, 2.2, 0.5]} intensity={0.6} color="#ffe9b0" distance={2} decay={2} />
    </>
  )
}

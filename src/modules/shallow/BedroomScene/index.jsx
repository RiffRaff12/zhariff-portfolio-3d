import { Suspense } from 'react'
import { Text } from '@react-three/drei'
import { RoomGeometry } from './RoomGeometry'
import { Bed, Desk, DeskChair, Bookshelf, FloorLamp, Window, Rug, Nightstand } from './Furniture'
import { BedroomLighting } from './Lighting'
import { EasterEggSystem } from '../EasterEggSystem'
import { ProjectInstallation } from '../ProjectInstallation'
import { AboutMeInstallation } from '../AboutMeInstallation'
import { SideQuestsInstallation } from '../SideQuestsInstallation'
import { PROJECTS } from '../../../data/projects'

// Comic diegetic onomatopoeia and labels rendered in the scene
function ComicWords() {
  return (
    <group>
      {/* Large background title on ceiling */}
      <Text
        position={[0, 3.45, -1.5]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        fontSize={1.4}
        font={undefined}
        color="#4da6ff"
        fillOpacity={0.06}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        ZHARIFF
      </Text>

      {/* "WHOOSH" near the door/entrance */}
      <Text
        position={[-2.0, 1.0, 2.6]}
        rotation={[0, 0.2, -0.08]}
        fontSize={0.38}
        color="#e63946"
        fillOpacity={0.55}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
      >
        WHOOSH!
      </Text>

      {/* "CLICK" near desk/monitor */}
      <Text
        position={[3.5, 1.5, -1.0]}
        rotation={[0, -Math.PI / 2, 0.05]}
        fontSize={0.28}
        color="#ffd166"
        fillOpacity={0.7}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        CLICK!
      </Text>

      {/* "ZZZ" above bed */}
      <Text
        position={[-2.8, 2.5, -2.5]}
        rotation={[0, 0.1, 0.12]}
        fontSize={0.42}
        color="#b8d4f0"
        fillOpacity={0.45}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.04}
      >
        Zzz...
      </Text>

      {/* Installation labels — pinned above each poster */}
      <Text
        position={[-3.72, 3.1, -1.5]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.13}
        color="#ffd166"
        fillOpacity={0.9}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.18}
      >
        ABOUT ME
      </Text>

      <Text
        position={[-3.72, 3.1, 1.5]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.13}
        color="#00b4d8"
        fillOpacity={0.9}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.18}
      >
        SIDE QUESTS
      </Text>
    </group>
  )
}

// Case study installations positioned around the room
function CaseStudyInstallations() {
  // Each installation is a "poster / pinboard" on a wall or surface
  const placements = [
    { projectIndex: 0, position: [3.8, 2.1, -2.5], rotation: [0, -Math.PI / 2, 0] }, // right wall back
    { projectIndex: 1, position: [3.8, 2.1, -0.5], rotation: [0, -Math.PI / 2, 0] }, // right wall mid
    { projectIndex: 2, position: [0.5, 2.1, -3.3], rotation: [0, 0, 0] },             // back wall center-right
    { projectIndex: 3, position: [-1.5, 2.1, -3.3], rotation: [0, 0, 0] },            // back wall center-left
    { projectIndex: 4, position: [3.8, 2.1, 1.2], rotation: [0, -Math.PI / 2, 0] }, // right wall front
  ]

  return (
    <>
      {placements.map(({ projectIndex, position, rotation }) => (
        <ProjectInstallation
          key={PROJECTS[projectIndex].id}
          project={PROJECTS[projectIndex]}
          position={position}
          rotation={rotation}
          interactionRadius={2.0}
        />
      ))}
    </>
  )
}

export function BedroomScene() {
  return (
    <group>
      <BedroomLighting />
      <RoomGeometry />
      <Rug />

      <Bed />
      <Nightstand />
      <Desk />
      <DeskChair />
      <Bookshelf />
      <FloorLamp />
      <Window />

      <ComicWords />

      <Suspense fallback={null}>
        <CaseStudyInstallations />
        <AboutMeInstallation
          position={[-3.75, 2.2, -1.5]}
          rotation={[0, Math.PI / 2, 0]}
          interactionRadius={2.2}
        />
        <SideQuestsInstallation
          position={[-3.75, 2.2, 1.5]}
          rotation={[0, Math.PI / 2, 0]}
          interactionRadius={2.2}
        />
        <EasterEggSystem />
      </Suspense>
    </group>
  )
}

import { Suspense } from 'react'
import { RoomGeometry } from './RoomGeometry'
import { Bed, Desk, DeskChair, Bookshelf, FloorLamp, Window, Rug, Nightstand } from './Furniture'
import { BedroomLighting } from './Lighting'
import { EasterEggSystem } from '../EasterEggSystem'
import { ProjectInstallation } from '../ProjectInstallation'
import { AboutMeInstallation } from '../AboutMeInstallation'
import { SideQuestsInstallation } from '../SideQuestsInstallation'
import { PROJECTS } from '../../../data/projects'

// Comic onomatopoeia decorations in the scene
function ComicWords() {
  return (
    <group>
      {/* These are text sprites on walls — placeholder using boxes as stand-ins */}
      {/* In production: use Text from @react-three/drei with custom comic font */}
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

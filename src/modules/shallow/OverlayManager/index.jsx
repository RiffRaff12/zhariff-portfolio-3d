import { useOverlay } from '../../../context/OverlayContext'
import { ComicPanelOverlay } from '../ComicPanelOverlay'
import { SideQuestOverlay } from '../SideQuestOverlay'
import { PROJECTS } from '../../../data/projects'
import { ABOUT_ME } from '../../../data/aboutMe'

function ProjectOverlay({ overlay, onClose }) {
  const project = PROJECTS.find(p => p.id === overlay.id)
  if (!project) return null
  return (
    <ComicPanelOverlay
      isOpen
      onClose={onClose}
      title={project.title}
      role={project.role}
      outcome={project.outcome}
      isConfidential={project.isConfidential}
      panels={project.panels}
      accentColor={project.color}
    />
  )
}

function AboutMeOverlay({ onClose }) {
  const panels = ABOUT_ME.sections.map(s => ({
    type: s.id,
    caption: s.caption,
    body: s.body,
    contactEmail: s.contactEmail,
    contactLinkedIn: s.contactLinkedIn,
  }))
  return (
    <ComicPanelOverlay
      isOpen
      onClose={onClose}
      title={ABOUT_ME.name}
      subtitle={ABOUT_ME.tagline}
      role="About Me"
      panels={panels}
      accentColor="#ffd166"
    />
  )
}

const OVERLAY_REGISTRY = {
  'project':     (overlay, onClose) => <ProjectOverlay overlay={overlay} onClose={onClose} />,
  'about-me':    (_, onClose)       => <AboutMeOverlay onClose={onClose} />,
  'side-quests': (_, onClose)       => <SideQuestOverlay onClose={onClose} />,
}

export function OverlayManager() {
  const { overlay, closeOverlay } = useOverlay()
  if (!overlay) return null
  const render = OVERLAY_REGISTRY[overlay.type]
  if (!render) return null
  return render(overlay, closeOverlay)
}

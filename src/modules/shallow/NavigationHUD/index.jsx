import { useProximity } from '../../../context/ProximityContext'
import { useDevice } from '../../../context/DeviceContext'
import { useActiveEasterEgg } from '../EasterEggSystem'
import { PROJECTS } from '../../../data/projects'
import { MobileGamepad } from '../../deep/MobileGamepad'

// Maps interaction IDs to human-readable labels
function getHighlightLabel(id) {
  if (!id) return null
  if (id === 'about-me') return 'About Me'
  if (id === 'side-quests') return 'Side Quests'
  if (id.startsWith('egg-')) return null // Easter eggs show tooltip, not prompt
  const project = PROJECTS.find(p => p.id === id)
  if (project) return project.installationLabel
  return 'Inspect'
}

function ComicCrosshair() {
  return (
    <div className="hud__crosshair" aria-hidden>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Starburst crosshair */}
        <circle cx="20" cy="20" r="3" fill="white" fillOpacity="0.9" />
        <line x1="20" y1="4" x2="20" y2="14" stroke="white" strokeWidth="2" strokeOpacity="0.8" />
        <line x1="20" y1="26" x2="20" y2="36" stroke="white" strokeWidth="2" strokeOpacity="0.8" />
        <line x1="4" y1="20" x2="14" y2="20" stroke="white" strokeWidth="2" strokeOpacity="0.8" />
        <line x1="26" y1="20" x2="36" y2="20" stroke="white" strokeWidth="2" strokeOpacity="0.8" />
        {/* Diagonal ticks for starburst feel */}
        <line x1="8" y1="8" x2="13" y2="13" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
        <line x1="27" y1="27" x2="32" y2="32" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
        <line x1="32" y1="8" x2="27" y2="13" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
        <line x1="8" y1="32" x2="13" y2="27" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
      </svg>
    </div>
  )
}

function InteractionPrompt({ label }) {
  return (
    <div className="hud__prompt">
      <span className="hud__prompt-key">E</span>
      <span className="hud__prompt-text">to view — {label}</span>
    </div>
  )
}

function EasterEggTooltip({ egg }) {
  return (
    <div className="hud__egg-tooltip">
      <div className="hud__egg-label">{egg.label}</div>
      <p className="hud__egg-copy">{egg.tooltipCopy}</p>
    </div>
  )
}

function ClickToLock() {
  return (
    <div className="hud__click-to-lock">
      <span>Click to explore</span>
    </div>
  )
}

export function NavigationHUD({ isLocked, mobileInputRef, onMobileInteract }) {
  const { highlightedId } = useProximity()
  const { isMobile } = useDevice()
  const activeEgg = useActiveEasterEgg()
  const label = getHighlightLabel(highlightedId)
  const showInteractPrompt = !!label && isLocked

  return (
    <>
      {/* Always-on crosshair */}
      {isLocked && <ComicCrosshair />}

      {/* Click-to-lock hint when pointer not locked */}
      {!isLocked && !isMobile && <ClickToLock />}

      {/* Interaction prompt */}
      {showInteractPrompt && <InteractionPrompt label={label} />}

      {/* Easter egg tooltip (no interaction needed — proximity-activated) */}
      {activeEgg && <EasterEggTooltip egg={activeEgg} />}

      {/* Mobile gamepad overlay */}
      {isMobile && (
        <MobileGamepad inputRef={mobileInputRef} onInteract={onMobileInteract} />
      )}
    </>
  )
}

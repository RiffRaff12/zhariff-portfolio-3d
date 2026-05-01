import { useEffect, useCallback } from 'react'

function PanelBlock({ panel, index }) {
  const isWide = index === 0 || (index === 3)
  return (
    <div className={`comic-panel comic-panel--${panel.type} ${isWide ? 'comic-panel--wide' : ''}`}>
      {panel.caption && (
        <div className="comic-panel__caption">{panel.caption}</div>
      )}
      <p className="comic-panel__body">{panel.body}</p>
      {panel.contactEmail && (
        <div className="comic-panel__contact">
          <a href={`mailto:${panel.contactEmail}`} className="comic-link">{panel.contactEmail}</a>
          <span> · </span>
          <span className="comic-link">{panel.contactLinkedIn}</span>
        </div>
      )}
    </div>
  )
}

export function ComicPanelOverlay({ isOpen, onClose, title, subtitle, role, outcome, isConfidential, panels, accentColor = '#4da6ff' }) {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div className="overlay" onClick={onClose} aria-modal role="dialog">
      <div
        className="overlay__panel"
        onClick={e => e.stopPropagation()}
        style={{ '--accent': accentColor }}
      >
        {/* Close button */}
        <button className="overlay__close" onClick={onClose} aria-label="Close">
          <span className="overlay__close-burst">✸</span>
        </button>

        {/* Header */}
        <div className="overlay__header">
          {isConfidential && (
            <div className="overlay__confidential-badge">[ Confidential ]</div>
          )}
          <div className="overlay__eyebrow">{role}</div>
          <h2 className="overlay__title">{title}</h2>
          {subtitle && <p className="overlay__subtitle">{subtitle}</p>}
        </div>

        {/* Outcome callout */}
        {outcome && (
          <div className="overlay__outcome">
            <span className="overlay__outcome-label">Outcome</span>
            <p className="overlay__outcome-text">{outcome}</p>
          </div>
        )}

        {/* Comic panels grid */}
        <div className="overlay__panels">
          {(panels ?? []).map((panel, i) => (
            <PanelBlock key={i} panel={panel} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

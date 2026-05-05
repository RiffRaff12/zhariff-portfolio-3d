import { useState } from 'react'
import { SIDE_QUESTS } from '../../../data/sideQuests'

export function SideQuestOverlay({ onClose }) {
  const [questIndex, setQuestIndex] = useState(0)
  const quest = SIDE_QUESTS[questIndex]

  return (
    <div className="overlay" onClick={onClose} aria-modal role="dialog">
      <div
        className="overlay__panel"
        onClick={e => e.stopPropagation()}
        style={{ '--accent': quest.color }}
      >
        <button className="overlay__close" onClick={onClose} aria-label="Close">
          <span className="overlay__close-burst">✸</span>
        </button>

        <div className="overlay__header">
          <div className="overlay__eyebrow">Side Quests</div>
          <h2 className="overlay__title">Personal Projects</h2>
          <p className="overlay__subtitle">Things I built because I needed them to exist.</p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {SIDE_QUESTS.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setQuestIndex(i)}
              className={`overlay__tab ${questIndex === i ? 'overlay__tab--active' : ''}`}
              style={{ '--accent': q.color }}
            >
              {q.title}
            </button>
          ))}
        </div>

        <div className="overlay__outcome">
          <span className="overlay__outcome-label">Status</span>
          <p className="overlay__outcome-text">{quest.status}</p>
        </div>

        <div className="overlay__panels">
          {quest.panels.map((panel, i) => (
            <div key={i} className={`comic-panel comic-panel--${panel.type} ${i === 0 ? 'comic-panel--wide' : ''}`}>
              {panel.caption && <div className="comic-panel__caption">{panel.caption}</div>}
              <p className="comic-panel__body">{panel.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

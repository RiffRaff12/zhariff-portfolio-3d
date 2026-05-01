import { useState, useEffect } from 'react'

export function Antechamber({ onEnter }) {
  const [ready, setReady] = useState(false)
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200)
    return () => clearTimeout(t)
  }, [])

  const handleEnter = () => {
    setEntering(true)
    setTimeout(onEnter, 800)
  }

  return (
    <div
      className={`antechamber ${ready ? 'antechamber--ready' : ''} ${entering ? 'antechamber--exiting' : ''}`}
    >
      <div className="antechamber__noise" />
      <div className="antechamber__halftone" />

      <div className="antechamber__content">
        <div className="antechamber__eyebrow">Product Designer</div>

        <h1 className="antechamber__name">
          <span className="antechamber__name-line">ZHA</span>
          <span className="antechamber__name-line antechamber__name-line--accent">RIFF</span>
        </h1>

        <p className="antechamber__tagline">
          "Chemical engineer turned pixel pusher.<br />
          This is not a normal portfolio."
        </p>

        <div className="antechamber__caption">
          <span className="antechamber__caption-bracket">[ Narrator voice ]</span>
          <span> He built this instead of sending a PDF. Make of that what you will.</span>
        </div>

        <button className="antechamber__enter-btn" onClick={handleEnter}>
          <span className="antechamber__enter-text">Enter the room</span>
          <svg className="antechamber__enter-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        <div className="antechamber__hint">
          <kbd>W A S D</kbd> to move &nbsp;·&nbsp; <kbd>Mouse</kbd> to look &nbsp;·&nbsp; <kbd>E</kbd> to interact
        </div>
      </div>

      <div className="antechamber__panel-lines" aria-hidden>
        <div className="antechamber__panel-line" />
        <div className="antechamber__panel-line" />
        <div className="antechamber__panel-line" />
      </div>

      <div className="antechamber__burst" aria-hidden>&#10038;</div>
    </div>
  )
}

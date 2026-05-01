import { useRef, useEffect, useCallback, useState } from 'react'
import * as THREE from 'three'

const JOYSTICK_SIZE = 80
const KNOB_SIZE = 36
const DEADZONE = 0.1

function Joystick({ style, onMove }) {
  const baseRef = useRef(null)
  const touch = useRef(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })

  const getRelative = (clientX, clientY) => {
    const rect = baseRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = clientX - cx
    const dy = clientY - cy
    const maxR = JOYSTICK_SIZE / 2
    const dist = Math.sqrt(dx * dx + dy * dy)
    const clampedDist = Math.min(dist, maxR)
    const angle = Math.atan2(dy, dx)
    return {
      x: (Math.cos(angle) * clampedDist) / maxR,
      y: (Math.sin(angle) * clampedDist) / maxR,
      px: Math.cos(angle) * clampedDist,
      py: Math.sin(angle) * clampedDist,
    }
  }

  const onTouchStart = (e) => {
    e.preventDefault()
    touch.current = e.changedTouches[0].identifier
  }

  const onTouchMove = (e) => {
    e.preventDefault()
    for (const t of e.changedTouches) {
      if (t.identifier === touch.current) {
        const { x, y, px, py } = getRelative(t.clientX, t.clientY)
        setKnob({ x: px, y: py })
        onMove(Math.abs(x) > DEADZONE ? x : 0, Math.abs(y) > DEADZONE ? y : 0)
        break
      }
    }
  }

  const onTouchEnd = (e) => {
    e.preventDefault()
    for (const t of e.changedTouches) {
      if (t.identifier === touch.current) {
        touch.current = null
        setKnob({ x: 0, y: 0 })
        onMove(0, 0)
        break
      }
    }
  }

  return (
    <div
      ref={baseRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        width: JOYSTICK_SIZE,
        height: JOYSTICK_SIZE,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.4)',
        background: 'rgba(0,0,0,0.25)',
        position: 'relative',
        touchAction: 'none',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.55)',
          border: '2px solid rgba(255,255,255,0.8)',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export function MobileGamepad({ inputRef, onInteract }) {
  // Look via right-side drag
  const lookOrigin = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  const handleMoveJoy = useCallback((x, y) => {
    if (inputRef.current) {
      inputRef.current.positionDelta = new THREE.Vector3(x, 0, y)
    }
  }, [inputRef])

  const handleLookStart = (e) => {
    const t = e.changedTouches[0]
    lookOrigin.current = { id: t.identifier, x: t.clientX, y: t.clientY }
  }

  const handleLookMove = (e) => {
    if (!lookOrigin.current) return
    for (const t of e.changedTouches) {
      if (t.identifier === lookOrigin.current.id) {
        const dx = t.clientX - lookOrigin.current.x
        const dy = t.clientY - lookOrigin.current.y
        // Dispatch synthetic mouse event to drive PointerLockControls look
        window.dispatchEvent(new CustomEvent('mobile-look', { detail: { dx, dy } }))
        lookOrigin.current = { ...lookOrigin.current, x: t.clientX, y: t.clientY }
        break
      }
    }
  }

  const handleLookEnd = (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === lookOrigin.current?.id) {
        lookOrigin.current = null
        break
      }
    }
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 20,
        userSelect: 'none',
      }}
    >
      {/* Left joystick — movement */}
      <div style={{ position: 'absolute', bottom: 32, left: 32, pointerEvents: 'auto' }}>
        <Joystick onMove={handleMoveJoy} />
      </div>

      {/* Right area — look */}
      <div
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '55%',
          height: '100%',
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      />

      {/* Interact button */}
      <button
        onTouchStart={(e) => { e.preventDefault(); onInteract?.() }}
        style={{
          position: 'absolute',
          bottom: 48,
          right: 48,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(77,166,255,0.8)',
          border: '3px solid #fff',
          color: '#fff',
          fontFamily: 'Bangers, cursive',
          fontSize: 18,
          letterSpacing: 1,
          cursor: 'pointer',
          pointerEvents: 'auto',
          touchAction: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        E
      </button>
    </div>
  )
}

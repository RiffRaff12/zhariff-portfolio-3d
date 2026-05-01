import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { ProximityContext } from '../../../context/ProximityContext'

// ─────────────────────────────────────────────────────
// ProximityProvider — lives OUTSIDE the Canvas.
// Provides context state readable by both Canvas and DOM.
// ─────────────────────────────────────────────────────
export function ProximityProvider({ children }) {
  const registry = useRef(new Map())          // id → { position, radius }
  const [highlightedId, setHighlightedId] = useState(null)
  const highlightedIdRef = useRef(null)
  const interactionListeners = useRef(new Set())
  const pendingInteraction = useRef(false)

  const register = useCallback((id, position, radius) => {
    registry.current.set(id, { position, radius })
    return () => registry.current.delete(id)
  }, [])

  const unregister = useCallback((id) => {
    registry.current.delete(id)
  }, [])

  const updateHighlighted = useCallback((id) => {
    if (id !== highlightedIdRef.current) {
      highlightedIdRef.current = id
      setHighlightedId(id)
    }
  }, [])

  const subscribeToInteraction = useCallback((cb) => {
    interactionListeners.current.add(cb)
    return () => interactionListeners.current.delete(cb)
  }, [])

  const fireInteraction = useCallback((id) => {
    for (const cb of interactionListeners.current) cb(id)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'KeyE') pendingInteraction.current = true
    }
    const onMobile = () => { pendingInteraction.current = true }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mobile-interact', onMobile)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mobile-interact', onMobile)
    }
  }, [])

  return (
    <ProximityContext.Provider
      value={{
        registry,
        highlightedId,
        updateHighlighted,
        register,
        unregister,
        subscribeToInteraction,
        fireInteraction,
        pendingInteraction,
      }}
    >
      {children}
    </ProximityContext.Provider>
  )
}

// ─────────────────────────────────────────────────────
// ProximityFrameUpdater — lives INSIDE the Canvas.
// Uses useFrame to compute proximity every frame.
// ─────────────────────────────────────────────────────
export function ProximityFrameUpdater() {
  const { registry, updateHighlighted, fireInteraction, pendingInteraction } = useProximity()

  useFrame(({ camera }) => {
    let nearest = null
    let nearestDist = Infinity

    for (const [id, { position, radius }] of registry.current) {
      const dist = camera.position.distanceTo(position)
      if (dist <= radius && dist < nearestDist) {
        nearest = id
        nearestDist = dist
      }
    }

    updateHighlighted(nearest)

    if (pendingInteraction.current) {
      pendingInteraction.current = false
      if (nearest !== null) fireInteraction(nearest)
    }
  })

  return null
}

// Re-export hook for convenience
export { useProximity } from '../../../context/ProximityContext'

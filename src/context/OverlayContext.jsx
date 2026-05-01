import { createContext, useContext, useState, useCallback } from 'react'

const OverlayContext = createContext({
  openOverlay: () => {},
  closeOverlay: () => {},
  overlay: null,
})

export function useOverlay() {
  return useContext(OverlayContext)
}

// overlay shape: { type: 'project' | 'about-me' | 'side-quests', id?: string }
export function OverlayProvider({ children }) {
  const [overlay, setOverlay] = useState(null)

  const openOverlay = useCallback((payload) => setOverlay(payload), [])
  const closeOverlay = useCallback(() => setOverlay(null), [])

  return (
    <OverlayContext.Provider value={{ overlay, openOverlay, closeOverlay }}>
      {children}
    </OverlayContext.Provider>
  )
}

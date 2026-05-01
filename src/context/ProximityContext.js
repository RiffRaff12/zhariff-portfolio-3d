import { createContext, useContext } from 'react'

export const ProximityContext = createContext({
  registry: { current: new Map() },
  highlightedId: null,
  updateHighlighted: () => {},
  register: () => () => {},
  unregister: () => {},
  subscribeToInteraction: () => () => {},
  fireInteraction: () => {},
})

export function useProximity() {
  return useContext(ProximityContext)
}

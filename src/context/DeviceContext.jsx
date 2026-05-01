import { createContext, useContext, useMemo } from 'react'

const DeviceContext = createContext({ isMobile: false })

export function DeviceProvider({ children }) {
  const isMobile = useMemo(() => {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    )
  }, [])

  return (
    <DeviceContext.Provider value={{ isMobile }}>
      {children}
    </DeviceContext.Provider>
  )
}

export function useDevice() {
  return useContext(DeviceContext)
}

import { createContext, useContext, useRef, useCallback, useEffect } from 'react'

const InputBusContext = createContext(null)

export function InputBusProvider({ children }) {
  const lookListeners = useRef(new Set())
  const interactListeners = useRef(new Set())

  const onLook = useCallback((dx, dy) => {
    for (const cb of lookListeners.current) cb(dx, dy)
  }, [])

  const onInteract = useCallback(() => {
    for (const cb of interactListeners.current) cb()
  }, [])

  const useLook = (cb) => {
    useEffect(() => {
      lookListeners.current.add(cb)
      return () => lookListeners.current.delete(cb)
    }, [cb])
  }

  const useInteract = (cb) => {
    useEffect(() => {
      interactListeners.current.add(cb)
      return () => interactListeners.current.delete(cb)
    }, [cb])
  }

  return (
    <InputBusContext.Provider value={{ onLook, onInteract, useLook, useInteract }}>
      {children}
    </InputBusContext.Provider>
  )
}

export function useInputBus() {
  return useContext(InputBusContext)
}

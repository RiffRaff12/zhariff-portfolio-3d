import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const AssetLoaderContext = createContext({
  get: () => null,
  getProgress: () => 1,
  isReady: true,
})

export function useAssetLoader() {
  return useContext(AssetLoaderContext)
}

export function AssetLoader({ manifest = {}, children }) {
  const cache = useRef(new Map())
  const [progress, setProgress] = useState(manifest && Object.keys(manifest).length === 0 ? 1 : 0)
  const [loadedCount, setLoadedCount] = useState(0)
  const totalRef = useRef(Object.keys(manifest).length)

  useEffect(() => {
    const entries = Object.entries(manifest)
    if (entries.length === 0) {
      setProgress(1)
      return
    }

    const loader = new GLTFLoader()
    let loaded = 0

    entries
      .sort(([, a], [, b]) => (a.priority ?? 2) - (b.priority ?? 2))
      .forEach(([key, { url }]) => {
        loader.load(
          url,
          (gltf) => {
            cache.current.set(key, gltf.scene)
            loaded++
            setProgress(loaded / entries.length)
            setLoadedCount(loaded)
          },
          undefined,
          (err) => {
            console.warn(`[AssetLoader] Failed to load "${key}":`, err)
            loaded++
            setProgress(loaded / entries.length)
            setLoadedCount(loaded)
          }
        )
      })
  }, []) // manifest is intentionally read once on mount

  const get = useCallback((key) => cache.current.get(key) ?? null, [])
  const getProgress = useCallback(() => progress, [progress])

  return (
    <AssetLoaderContext.Provider value={{ get, getProgress, isReady: progress >= 1 }}>
      {children}
    </AssetLoaderContext.Provider>
  )
}

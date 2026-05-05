import { useState, useRef, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { DeviceProvider, useDevice } from './context/DeviceContext'
import { ProximityProvider, ProximityFrameUpdater } from './modules/deep/ProximityInteractionSystem'
import { OverlayProvider } from './context/OverlayContext'
import { InputBusProvider, useInputBus } from './context/InputBusContext'
import { AssetLoader } from './modules/deep/AssetLoader'
import { SpiderVerseRenderer } from './modules/deep/SpiderVerseRenderer'
import { FirstPersonController } from './modules/deep/FirstPersonController'
import { Antechamber } from './modules/shallow/Antechamber'
import { BedroomScene } from './modules/shallow/BedroomScene'
import { NavigationHUD } from './modules/shallow/NavigationHUD'
import { OverlayManager } from './modules/shallow/OverlayManager'
import { ASSET_MANIFEST } from './modules/deep/AssetLoader/manifest'

// The 3D world — rendered inside Canvas
function World() {
  return (
    <Suspense fallback={null}>
      <AssetLoader manifest={ASSET_MANIFEST}>
        <ProximityFrameUpdater />
        <BedroomScene />
        <SpiderVerseRenderer enabled />
      </AssetLoader>
    </Suspense>
  )
}

// Full bedroom experience — Canvas + DOM HUD layer
function BedroomExperience({ visible }) {
  const [isLocked, setIsLocked] = useState(false)
  const mobileInputRef = useRef({ positionDelta: null })
  const { isMobile } = useDevice()

  const { onInteract: handleMobileInteract } = useInputBus()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.7s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <Canvas
        camera={{ fov: 75, near: 0.05, far: 50 }}
        shadows
        gl={{ antialias: false }}
        style={{ position: 'fixed', inset: 0 }}
      >
        <color attach="background" args={['#050810']} />
        <fog attach="fog" args={['#050810', 10, 24]} />
        <World />
        <FirstPersonController
          isActive={visible}
          onLockChange={setIsLocked}
          inputRef={mobileInputRef}
        />
      </Canvas>

      {/* DOM HUD layer — outside Canvas, shares ProximityContext + OverlayContext */}
      <NavigationHUD
        isLocked={isLocked || isMobile}
        mobileInputRef={mobileInputRef}
        onMobileInteract={handleMobileInteract}
      />

      {/* Overlay renderer — outside Canvas, handles all panel overlays */}
      <OverlayManager />
    </div>
  )
}

function AppContent() {
  const [phase, setPhase] = useState('antechamber') // 'antechamber' | 'transitioning' | 'bedroom'

  const handleEnter = useCallback(() => {
    setPhase('transitioning')
    setTimeout(() => setPhase('bedroom'), 900)
  }, [])

  return (
    <div className="app">
      {(phase === 'antechamber' || phase === 'transitioning') && (
        <Antechamber onEnter={phase === 'antechamber' ? handleEnter : () => {}} />
      )}
      {phase !== 'antechamber' && (
        <BedroomExperience visible={phase === 'bedroom'} />
      )}
    </div>
  )
}

export function App() {
  return (
    <DeviceProvider>
      <InputBusProvider>
        <ProximityProvider>
          <OverlayProvider>
            <AppContent />
          </OverlayProvider>
        </ProximityProvider>
      </InputBusProvider>
    </DeviceProvider>
  )
}

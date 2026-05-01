import { useMemo, useRef } from 'react'
import { EffectComposer, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import { HalftoneEffect } from './HalftoneEffect'
import { OutlineEffect } from './OutlineEffect'

function SpiderVerseEffects({ halftone = true, outline = true, chromaticAberration = true }) {
  const halftoneEffect = useMemo(() => new HalftoneEffect({ dotSize: 0.01, contrast: 0.95 }), [])
  const outlineEffect = useMemo(() => new OutlineEffect({ threshold: 0.004, strength: 60.0 }), [])

  return (
    <EffectComposer depthBuffer>
      {outline && <primitive object={outlineEffect} />}
      {halftone && <primitive object={halftoneEffect} />}
      {chromaticAberration && (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0.0015, 0.0015)}
          radialModulation={false}
          modulationOffset={0.5}
        />
      )}
    </EffectComposer>
  )
}

export function SpiderVerseRenderer({ children, enabled = true, effects = {} }) {
  return (
    <>
      {children}
      {enabled && <SpiderVerseEffects {...effects} />}
    </>
  )
}

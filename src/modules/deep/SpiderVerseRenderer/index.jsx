import { useMemo } from 'react'
import {
  EffectComposer,
  ChromaticAberration,
  wrapEffect,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import { HalftoneEffect } from './HalftoneEffect'
import { OutlineEffect } from './OutlineEffect'

// Wrap custom Effect classes into @react-three/postprocessing-compatible components.
// wrapEffect creates a React component that registers the effect with EffectComposer
// via the internal context — the only supported way to use custom effects.
const HalftonePass = wrapEffect(HalftoneEffect)
const OutlinePass = wrapEffect(OutlineEffect)

function SpiderVerseEffects({ halftone = true, outline = true, chromaticAberration = true }) {
  const aberrationOffset = useMemo(() => new Vector2(0.0018, 0.0018), [])

  return (
    <EffectComposer multisampling={0} depthBuffer>
      {outline && <OutlinePass threshold={0.003} strength={65.0} />}
      {halftone && <HalftonePass dotSize={0.011} contrast={0.92} />}
      {chromaticAberration && (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={aberrationOffset}
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

import { Effect } from 'postprocessing'
import { Uniform } from 'three'

// resolution is a built-in vec2 uniform provided by postprocessing's EffectPass
const fragmentShader = /* glsl */ `
  uniform float dotSize;
  uniform float contrast;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float s = dotSize;

    // Snap to cell centre and measure distance within cell [0..1]
    vec2 snappedUV = floor(uv / s) * s + s * 0.5;
    vec2 cellFrac  = (uv - snappedUV + s * 0.5) / s; // 0..1 within cell
    float dist = length(cellFrac - vec2(0.5)) * 2.0;   // 0 at centre, 1 at corner

    // Luminance of cell center drives dot radius
    vec4  cellColor = texture2D(inputBuffer, snappedUV);
    float lum       = dot(cellColor.rgb, vec3(0.299, 0.587, 0.114));
    float radius    = lum * contrast;

    float dotMask = 1.0 - smoothstep(radius - 0.06, radius + 0.06, dist);

    // Dark interstitial — slightly desaturated deep blue for Spider-Verse ink
    vec3 bg  = vec3(0.04, 0.05, 0.10);
    vec3 col = mix(bg, inputColor.rgb, dotMask);

    outputColor = vec4(col, inputColor.a);
  }
`

export class HalftoneEffect extends Effect {
  constructor({ dotSize = 0.012, contrast = 0.92 } = {}) {
    super('HalftoneEffect', fragmentShader, {
      uniforms: new Map([
        ['dotSize',   new Uniform(dotSize)],
        ['contrast',  new Uniform(contrast)],
      ]),
    })
  }
}

import { Effect, EffectAttribute } from 'postprocessing'
import { Uniform } from 'three'

// resolution is a built-in vec2 (width, height) provided by postprocessing's EffectPass.
// EffectAttribute.DEPTH tells the EffectComposer to provide the depth buffer.
const fragmentShader = /* glsl */ `
  uniform float threshold;
  uniform float strength;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float stepX = 1.0 / resolution.x;
    float stepY = 1.0 / resolution.y;

    // Sobel depth edge detection
    float d00 = texture2D(depthBuffer, uv + vec2(-stepX, -stepY)).r;
    float d10 = texture2D(depthBuffer, uv + vec2( 0.0,   -stepY)).r;
    float d20 = texture2D(depthBuffer, uv + vec2( stepX, -stepY)).r;
    float d01 = texture2D(depthBuffer, uv + vec2(-stepX,  0.0  )).r;
    float d21 = texture2D(depthBuffer, uv + vec2( stepX,  0.0  )).r;
    float d02 = texture2D(depthBuffer, uv + vec2(-stepX,  stepY)).r;
    float d12 = texture2D(depthBuffer, uv + vec2( 0.0,    stepY)).r;
    float d22 = texture2D(depthBuffer, uv + vec2( stepX,  stepY)).r;

    float gx = -d00 + d20 - 2.0*d01 + 2.0*d21 - d02 + d22;
    float gy = -d00 - 2.0*d10 - d20 + d02 + 2.0*d12 + d22;
    float edge = sqrt(gx*gx + gy*gy);

    float outline = smoothstep(threshold - 0.002, threshold + 0.002, edge * strength);

    // Pure ink-black outline
    outputColor = vec4(mix(inputColor.rgb, vec3(0.0), outline), inputColor.a);
  }
`

export class OutlineEffect extends Effect {
  constructor({ threshold = 0.003, strength = 70.0 } = {}) {
    super('SpiderVerseOutlineEffect', fragmentShader, {
      attributes: EffectAttribute.DEPTH,
      uniforms: new Map([
        ['threshold', new Uniform(threshold)],
        ['strength',  new Uniform(strength)],
      ]),
    })
  }
}

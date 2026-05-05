import { describe, it, expect } from 'vitest'
import { SCENE_CONFIG } from './scene.config'

describe('SCENE_CONFIG', () => {
  it('exports room dimensions', () => {
    expect(SCENE_CONFIG.room).toMatchObject({
      width: expect.any(Number),
      height: expect.any(Number),
      depth: expect.any(Number),
    })
  })

  it('exports movement bounds', () => {
    expect(SCENE_CONFIG.bounds).toMatchObject({
      minX: expect.any(Number),
      maxX: expect.any(Number),
      minZ: expect.any(Number),
      maxZ: expect.any(Number),
    })
  })

  it('bounds are inside room dimensions', () => {
    const { room, bounds } = SCENE_CONFIG
    expect(bounds.maxX).toBeLessThanOrEqual(room.width / 2)
    expect(bounds.minX).toBeGreaterThanOrEqual(-room.width / 2)
    expect(bounds.maxZ).toBeLessThanOrEqual(room.depth / 2)
    expect(bounds.minZ).toBeGreaterThanOrEqual(-room.depth / 2)
  })

  it('exports colliders array with required shape', () => {
    expect(Array.isArray(SCENE_CONFIG.colliders)).toBe(true)
    for (const c of SCENE_CONFIG.colliders) {
      expect(c).toMatchObject({
        x: expect.any(Number),
        z: expect.any(Number),
        r: expect.any(Number),
      })
    }
  })

  it('exports at least one collider', () => {
    expect(SCENE_CONFIG.colliders.length).toBeGreaterThan(0)
  })

  it('exports installations array with required shape', () => {
    expect(Array.isArray(SCENE_CONFIG.installations)).toBe(true)
    for (const inst of SCENE_CONFIG.installations) {
      expect(inst).toMatchObject({
        id: expect.any(String),
        position: expect.any(Array),
        rotation: expect.any(Array),
        type: expect.any(String),
      })
    }
  })

  it('exports lights array with required shape', () => {
    expect(Array.isArray(SCENE_CONFIG.lights)).toBe(true)
    for (const light of SCENE_CONFIG.lights) {
      expect(light).toMatchObject({
        type: expect.any(String),
        position: expect.any(Array),
        color: expect.any(String),
        intensity: expect.any(Number),
      })
    }
  })
})

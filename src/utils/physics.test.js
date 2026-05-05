import { describe, it, expect } from 'vitest'
import { applyCollision, findNearestInProximity } from './physics'

describe('applyCollision', () => {
  const bounds = { minX: -4, maxX: 4, minZ: -3, maxZ: 3 }

  it('leaves position unchanged when inside bounds with no colliders', () => {
    expect(applyCollision(1, 1, [], bounds)).toEqual({ x: 1, z: 1 })
  })

  it('clamps x to maxX when position exceeds right bound', () => {
    const result = applyCollision(5, 0, [], bounds)
    expect(result.x).toBe(4)
  })

  it('clamps x to minX when position exceeds left bound', () => {
    const result = applyCollision(-5, 0, [], bounds)
    expect(result.x).toBe(-4)
  })

  it('clamps z to maxZ when position exceeds far bound', () => {
    const result = applyCollision(0, 5, [], bounds)
    expect(result.z).toBe(3)
  })

  it('clamps z to minZ when position exceeds near bound', () => {
    const result = applyCollision(0, -5, [], bounds)
    expect(result.z).toBe(-3)
  })

  it('pushes position out of a collider sphere', () => {
    const colliders = [{ x: 0, z: 0, r: 1 }]
    const result = applyCollision(0.3, 0, colliders, bounds)
    const dist = Math.sqrt(result.x ** 2 + result.z ** 2)
    expect(dist).toBeGreaterThanOrEqual(1)
  })

  it('handles multiple colliders', () => {
    const colliders = [
      { x: 2, z: 0, r: 1 },
      { x: -2, z: 0, r: 1 },
    ]
    const result = applyCollision(2.3, 0, colliders, bounds)
    const distFromFirst = Math.sqrt((result.x - 2) ** 2 + result.z ** 2)
    expect(distFromFirst).toBeGreaterThanOrEqual(1)
  })
})

describe('findNearestInProximity', () => {
  it('returns null when registry is empty', () => {
    expect(findNearestInProximity({ x: 0, z: 0 }, new Map())).toBeNull()
  })

  it('returns null when no object is within its radius', () => {
    const registry = new Map([
      ['obj1', { position: { x: 10, z: 10 }, radius: 1 }],
    ])
    expect(findNearestInProximity({ x: 0, z: 0 }, registry)).toBeNull()
  })

  it('returns the object id when camera is within radius', () => {
    const registry = new Map([
      ['obj1', { position: { x: 1, z: 0 }, radius: 2 }],
    ])
    expect(findNearestInProximity({ x: 0, z: 0 }, registry)).toBe('obj1')
  })

  it('returns the nearest object when multiple are in range', () => {
    const registry = new Map([
      ['far', { position: { x: 1.5, z: 0 }, radius: 3 }],
      ['near', { position: { x: 0.5, z: 0 }, radius: 3 }],
    ])
    expect(findNearestInProximity({ x: 0, z: 0 }, registry)).toBe('near')
  })
})

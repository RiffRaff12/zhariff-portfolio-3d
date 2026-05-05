import { describe, it, expect } from 'vitest'
import { getRelativeJoystick, applyDeadzone } from './input'

describe('getRelativeJoystick', () => {
  const rect = { left: 100, top: 100, width: 200, height: 200 }
  const size = 60

  it('returns zero vector when touch is at joystick center', () => {
    const result = getRelativeJoystick({ x: 200, y: 200 }, rect, size)
    expect(result).toEqual({ x: 0, y: 0 })
  })

  it('returns positive x when touch is to the right of center', () => {
    const result = getRelativeJoystick({ x: 230, y: 200 }, rect, size)
    expect(result.x).toBeGreaterThan(0)
  })

  it('returns negative x when touch is to the left of center', () => {
    const result = getRelativeJoystick({ x: 170, y: 200 }, rect, size)
    expect(result.x).toBeLessThan(0)
  })

  it('clamps output to [-1, 1] when touch is far outside joystick', () => {
    const result = getRelativeJoystick({ x: 500, y: 200 }, rect, size)
    expect(result.x).toBeLessThanOrEqual(1)
    expect(result.x).toBeGreaterThanOrEqual(-1)
  })

  it('returns magnitude <= 1 for any input', () => {
    const result = getRelativeJoystick({ x: 0, y: 0 }, rect, size)
    const mag = Math.sqrt(result.x ** 2 + result.y ** 2)
    expect(mag).toBeLessThanOrEqual(1)
  })
})

describe('applyDeadzone', () => {
  it('returns zero vector when input is within threshold', () => {
    expect(applyDeadzone(0.05, 0.05, 0.1)).toEqual({ x: 0, y: 0 })
  })

  it('returns input unchanged when magnitude exceeds threshold', () => {
    const result = applyDeadzone(1, 0, 0.1)
    expect(result.x).toBe(1)
    expect(result.y).toBe(0)
  })

  it('returns zero vector exactly at threshold boundary', () => {
    expect(applyDeadzone(0.1, 0, 0.1)).toEqual({ x: 0, y: 0 })
  })
})

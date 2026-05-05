import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { InputBusProvider, useInputBus } from './InputBusContext'

const wrapper = ({ children }) => <InputBusProvider>{children}</InputBusProvider>

describe('InputBus', () => {
  it('useLook subscriber fires when onLook is dispatched', () => {
    const onLook = vi.fn()
    const { result } = renderHook(
      () => {
        const bus = useInputBus()
        bus.useLook(onLook)
        return bus
      },
      { wrapper }
    )
    act(() => result.current.onLook(3, -2))
    expect(onLook).toHaveBeenCalledWith(3, -2)
  })

  it('useInteract subscriber fires when onInteract is dispatched', () => {
    const onInteract = vi.fn()
    const { result } = renderHook(
      () => {
        const bus = useInputBus()
        bus.useInteract(onInteract)
        return bus
      },
      { wrapper }
    )
    act(() => result.current.onInteract())
    expect(onInteract).toHaveBeenCalledTimes(1)
  })

  it('multiple useLook subscribers all fire', () => {
    const cb1 = vi.fn()
    const cb2 = vi.fn()
    const { result } = renderHook(
      () => {
        const bus = useInputBus()
        bus.useLook(cb1)
        bus.useLook(cb2)
        return bus
      },
      { wrapper }
    )
    act(() => result.current.onLook(1, 2))
    expect(cb1).toHaveBeenCalledWith(1, 2)
    expect(cb2).toHaveBeenCalledWith(1, 2)
  })

  it('useLook subscriber is cleaned up on unmount', () => {
    const onLook = vi.fn()
    const { result, unmount } = renderHook(
      () => {
        const bus = useInputBus()
        bus.useLook(onLook)
        return bus
      },
      { wrapper }
    )
    unmount()
    act(() => result.current.onLook(1, 2))
    expect(onLook).not.toHaveBeenCalled()
  })
})

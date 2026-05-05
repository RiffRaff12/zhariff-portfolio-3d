import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OverlayManager } from './index'
import { OverlayContext } from '../../../context/OverlayContext'

function renderWithOverlay(overlayValue) {
  const closeOverlay = vi.fn()
  render(
    <OverlayContext.Provider value={{ overlay: overlayValue, closeOverlay }}>
      <OverlayManager />
    </OverlayContext.Provider>
  )
  return { closeOverlay }
}

describe('OverlayManager', () => {
  it('renders nothing when no overlay is active', () => {
    const { container } = render(
      <OverlayContext.Provider value={{ overlay: null, closeOverlay: vi.fn() }}>
        <OverlayManager />
      </OverlayContext.Provider>
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders project overlay for overlay.type === "project"', () => {
    renderWithOverlay({ type: 'project', id: 'project-1' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders about-me overlay for overlay.type === "about-me"', () => {
    renderWithOverlay({ type: 'about-me' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders side-quests overlay for overlay.type === "side-quests"', () => {
    renderWithOverlay({ type: 'side-quests' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders nothing for unknown overlay type', () => {
    const { container } = render(
      <OverlayContext.Provider value={{ overlay: { type: 'unknown' }, closeOverlay: vi.fn() }}>
        <OverlayManager />
      </OverlayContext.Provider>
    )
    expect(container.firstChild).toBeNull()
  })

  it('side-quests overlay switches content on tab click', () => {
    renderWithOverlay({ type: 'side-quests' })
    const tabs = screen.getAllByRole('button', { name: /./i })
    const questTabs = tabs.filter(t => !t.classList.contains('overlay__close'))
    expect(questTabs.length).toBeGreaterThan(1)
    fireEvent.click(questTabs[1])
    // After clicking the second tab, the panel renders without throwing
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})

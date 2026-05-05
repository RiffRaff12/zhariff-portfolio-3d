export function getRelativeJoystick(clientXY, rect, size) {
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const dx = clientXY.x - centerX
  const dy = clientXY.y - centerY
  const maxDist = size / 2
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist === 0) return { x: 0, y: 0 }
  const clamped = Math.min(dist, maxDist)
  return {
    x: (dx / dist) * (clamped / maxDist),
    y: (dy / dist) * (clamped / maxDist),
  }
}

export function applyDeadzone(x, y, threshold) {
  const mag = Math.sqrt(x * x + y * y)
  if (mag <= threshold) return { x: 0, y: 0 }
  return { x, y }
}

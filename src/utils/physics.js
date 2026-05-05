export function applyCollision(x, z, colliders, bounds) {
  let rx = x
  let rz = z

  for (const { x: cx, z: cz, r } of colliders) {
    const dx = rx - cx
    const dz = rz - cz
    const dist = Math.sqrt(dx * dx + dz * dz)
    if (dist < r && dist > 0) {
      const scale = r / dist
      rx = cx + dx * scale
      rz = cz + dz * scale
    }
  }

  rx = Math.max(bounds.minX, Math.min(bounds.maxX, rx))
  rz = Math.max(bounds.minZ, Math.min(bounds.maxZ, rz))

  return { x: rx, z: rz }
}

export function findNearestInProximity(cameraPos, registry) {
  let nearestId = null
  let nearestDist = Infinity

  for (const [id, { position, radius }] of registry) {
    const dx = cameraPos.x - position.x
    const dz = cameraPos.z - position.z
    const dist = Math.sqrt(dx * dx + dz * dz)
    if (dist <= radius && dist < nearestDist) {
      nearestDist = dist
      nearestId = id
    }
  }

  return nearestId
}

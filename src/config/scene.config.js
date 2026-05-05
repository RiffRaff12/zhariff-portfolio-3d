export const SCENE_CONFIG = {
  room: {
    width: 9,
    height: 3.5,
    depth: 7,
  },

  bounds: {
    minX: -4.0,
    maxX: 4.0,
    minZ: -3.0,
    maxZ: 3.0,
  },

  // Cylindrical obstacle colliders — must match furniture positions
  colliders: [
    { x: 2.8,  z: -2.2, r: 0.9 }, // desk
    { x: -2.8, z: -1.8, r: 1.0 }, // bed
    { x: -3.6, z:  0.5, r: 0.5 }, // bookshelf
  ],

  // Furniture anchor positions (group origin, y=0 floor level)
  furniture: {
    bed:       { position: [-2.8, 0, -2.2] },
    desk:      { position: [2.8,  0, -1.8] },
    bookshelf: { position: [-3.5, 0,  0.5] },
    nightstand:{ position: [-1.6, 0, -2.8] },
    deskChair: { position: [2.3,  0, -1.2] },
    floorLamp: { position: [-2.2, 0,  1.2] },
    window:    { position: [4.3,  1.5, 0]  },
    rug:       { position: [0,    0.01, 0]  },
  },

  // Portfolio section installation boards
  installations: [
    { id: 'project-0', type: 'project', projectIndex: 0, position: [3.8, 2.1, -2.5], rotation: [0, -Math.PI / 2, 0], interactionRadius: 2.0 },
    { id: 'project-1', type: 'project', projectIndex: 1, position: [3.8, 2.1, -0.5], rotation: [0, -Math.PI / 2, 0], interactionRadius: 2.0 },
    { id: 'project-2', type: 'project', projectIndex: 2, position: [0.5, 2.1, -3.3], rotation: [0, 0, 0],            interactionRadius: 2.0 },
    { id: 'project-3', type: 'project', projectIndex: 3, position: [-1.5, 2.1, -3.3], rotation: [0, 0, 0],           interactionRadius: 2.0 },
    { id: 'project-4', type: 'project', projectIndex: 4, position: [3.8, 2.1, 1.2],  rotation: [0, -Math.PI / 2, 0], interactionRadius: 2.0 },
    { id: 'about-me',  type: 'about-me',   position: [-3.75, 2.2, -1.5], rotation: [0, Math.PI / 2, 0], interactionRadius: 2.2 },
    { id: 'side-quests', type: 'side-quests', position: [-3.75, 2.2, 1.5],  rotation: [0, Math.PI / 2, 0], interactionRadius: 2.2 },
  ],

  // Scene lights
  lights: [
    { type: 'ambient',     position: [0, 0, 0],      color: '#1a2a4a', intensity: 0.25 },
    { type: 'directional', position: [3.5, 3, -2.5], color: '#b8d4f0', intensity: 1.2  },
    { type: 'point',       position: [2.8, 1.9, -1.8], color: '#ffd166', intensity: 2.0  }, // desk lamp
    { type: 'point',       position: [2.6, 1.6, -2.4], color: '#4da6ff', intensity: 1.0  }, // monitor glow
    { type: 'point',       position: [-2.8, 0.1, -1.8], color: '#e63946', intensity: 0.4 }, // under-bed
    { type: 'point',       position: [-3.5, 2.2, 0.5], color: '#ffe9b0', intensity: 0.6  }, // bookshelf
  ],
}

export const sourceMutationNames = {
  LOAD_SOURCE: 'LOAD_SOURCE',
  LOAD_MOVEMENT: 'LOAD_MOVEMENT',
  MODIFY_SOURCE: 'MODIFY_SOURCE',
  MOVE_SOURCE: 'MOVE_SOURCE',
  SET_PAGE: 'SET_PAGE',
  ACTIVATE_SOURCE: 'ACTIVATE_SOURCE'
}

export const sourceActionNames = {
  loadSources: 'loadSources',
  loadMovements: 'loadMovements',
  loadZones: 'loadZones',
  activateZone: 'activateZone'
}

export const sourceGetterNames = {
  movements: 'movements',
  getMovementById: 'getMovementById',
  sources: 'sources',
  workSources: 'workSources',
  activeSourceId: 'activeSourceId',
  activeSource: 'activeSource',
  getSourceById: 'getSourceById',
  activeZoneId: 'activeZoneId',
  activeZone: 'activeZone',
  getZoneById: 'getZoneById',
  getPageMarkers: 'getPageMarkers'
}

export const sourcesNames = {
  state: {
    movements: 'movements',
    sources: 'sources',
    activeSourceId: 'activeSourceId',
    pages: 'pages'
  },
  mutations: sourceMutationNames,
  actions: sourceActionNames,
  getters: sourceGetterNames
}

export default sourcesNames

/**
 * @namespace store.actions
 */
export const actions = {
  createOpenSeaDragon: 'createOpenSeaDragon',
  destroyOpenSeaDragon: 'destroyOpenSeaDragon',
  activateZone: 'activateZone',
  loadSources: 'loadSources',
  loadComplaints: 'loadComplaints',
  createAnnotation: 'createAnnotation',
  modifyAnnotation: 'modifyAnnotation'
}

export const mutations = {
  UPDATE_SCALE: 'UPDATE_SCALE',
  LOAD_SOURCE: 'LOAD_SOURCE',
  LOAD_COMPLAINT: 'LOAD_COMPLAINT',
  MODIFY_SOURCE: 'MODIFY_SOURCE',
  MOVE_SOURCE: 'MOVE_SOURCE',
  SET_PAGE: 'SET_PAGE',
  ACTIVATE_SOURCE: 'ACTIVATE_SOURCE',
  ADD_ANNOTATION: 'ADD_ANNOTATION',
  ACTIVATE_ANNOTATION: 'ACTIVATE_ANNOTATION',
  MODIFY_ANNOTATION: 'MODIFY_ANNOTATION'
}

export default { actions }

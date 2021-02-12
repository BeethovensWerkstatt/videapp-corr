/**
 * @namespace store.actions
 */
export const actions = {
  createOpenSeaDragon: 'createOpenSeaDragon',
  destroyOpenSeaDragon: 'destroyOpenSeaDragon',
  loadWorks: 'loadWorks',
  loadSources: 'loadSources',
  loadComplaints: 'loadComplaints',
  activateZone: 'activateZone',
  createAnnotation: 'createAnnotation',
  modifyAnnotation: 'modifyAnnotation'
}

export const mutations = {
  UPDATE_SCALE: 'UPDATE_SCALE',
  LOAD_WORK: 'LOAD_WORK',
  LOAD_SOURCE: 'LOAD_SOURCE',
  LOAD_COMPLAINT: 'LOAD_COMPLAINT',
  MODIFY_SOURCE: 'MODIFY_SOURCE',
  MOVE_SOURCE: 'MOVE_SOURCE',
  SET_PAGE: 'SET_PAGE',
  ACTIVATE_SOURCE: 'ACTIVATE_SOURCE',
  ACTIVATE_COMPLAINT: 'ACTIVATE_COMPLAINT',
  ADD_ANNOTATION: 'ADD_ANNOTATION',
  ACTIVATE_ANNOTATION: 'ACTIVATE_ANNOTATION',
  MODIFY_ANNOTATION: 'MODIFY_ANNOTATION'
}

export default { actions }

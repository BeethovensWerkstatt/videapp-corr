/**
 * register action and mutation names
 *
 * @namespace store.names
 */

export const actions = {
  loadComplaints: 'loadComplaints',
  createAnnotation: 'createAnnotation',
  modifyAnnotation: 'modifyAnnotation'
}

/**
 * register action name
 * @memberof store.names
 * @param {Object} actions
 */
export const registerActions = function (obj) {
  for (const n in obj) {
    if (obj[n] instanceof Function) {
      actions[n] = n
    }
  }
}

export const mutations = {
  LOAD_COMPLAINT: 'LOAD_COMPLAINT',
  ACTIVATE_COMPLAINT: 'ACTIVATE_COMPLAINT',
  ADD_ANNOTATION: 'ADD_ANNOTATION',
  ACTIVATE_ANNOTATION: 'ACTIVATE_ANNOTATION',
  MODIFY_ANNOTATION: 'MODIFY_ANNOTATION'
}

/**
 * register action name
 * @memberof store.names
 * @param {Object} actions
 */
export const registerMutations = function (obj) {
  for (const n in obj) {
    if (obj[n] instanceof Function) {
      mutations[n] = n
    }
  }
}

export default { actions, mutations, registerMutations, registerActions }

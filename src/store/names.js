import { OSDnames } from './osd'
import { pagesNames } from './pages'

/**
 * register action and mutation names
 *
 * @module store.names
 */

export const state = {
  ...OSDnames.state,
  ...pagesNames.state
}
export const getters = {
  ...OSDnames.getters,
  ...pagesNames.getters
}

export const actions = {
  ...OSDnames.actions,
  ...pagesNames.actions
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
  ...OSDnames.mutations,
  ...pagesNames.mutations
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

export default { actions, mutations, getters, state, registerMutations, registerActions }

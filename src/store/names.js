import { runtimeNames } from './runtime'
import { processingNames } from './processing'
import { DAnames } from './dataAccess'
import { OSDnames } from './osd'
import { pagesNames } from './pages'

/**
 * register action and mutation names
 *
 * @module store.names
 */

export const state = {
  ...runtimeNames.state,
  ...processingNames.state,
  ...DAnames.state,
  ...OSDnames.state,
  ...pagesNames.state
}
export const getters = {
  ...runtimeNames.getters,
  ...processingNames.getters,
  ...DAnames.getters,
  ...OSDnames.getters,
  ...pagesNames.getters
}

export const mutations = {
  ...runtimeNames.mutations,
  ...processingNames.mutations,
  ...DAnames.mutations,
  ...OSDnames.mutations,
  ...pagesNames.mutations
}

export const actions = {
  ...runtimeNames.actions,
  ...processingNames.actions,
  ...DAnames.actions,
  ...OSDnames.actions,
  ...pagesNames.actions
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

export default { actions, mutations, getters, state, registerMutations, registerActions }

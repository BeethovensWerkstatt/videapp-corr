import { runtimeNames } from './runtime'
import { DAnames } from './dataAccess'
import { OSDnames } from './osd'
import { pagesNames } from './pages'
import { Infoboxnames } from './infobox'

/**
 * register action and mutation names
 *
 * @module store.names
 */

export const state = {
  ...runtimeNames.state,
  ...DAnames.state,
  ...OSDnames.state,
  ...pagesNames.state,
  ...Infoboxnames.state
}
export const getters = {
  ...runtimeNames.getters,
  ...DAnames.getters,
  ...OSDnames.getters,
  ...pagesNames.getters,
  ...Infoboxnames.getters
}

export const mutations = {
  ...runtimeNames.mutations,
  ...DAnames.mutations,
  ...OSDnames.mutations,
  ...pagesNames.mutations,
  ...Infoboxnames.mutations
}

export const actions = {
  ...runtimeNames.actions,
  ...DAnames.actions,
  ...OSDnames.actions,
  ...pagesNames.actions,
  ...Infoboxnames.actions
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

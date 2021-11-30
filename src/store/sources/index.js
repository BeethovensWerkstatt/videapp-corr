import mutations, { sourceMutationNames } from './mutations'
import actions, { sourceActionNames } from './actions'
import getters, { sourceGetterNames } from './getters'

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

/**
 * @namespace store.sources
 */
const sourcesModule = {
  /**
   * @namespace store.sources.state
   * @property {Object} movements movement objects
   * @property {Object[]} sources source objects
   * @property {String} activeSourceId id of selected source
   */
  state: {
    [sourcesNames.state.movements]: {},
    [sourcesNames.state.sources]: [],
    [sourcesNames.state.activeSourceId]: null,
    [sourcesNames.state.pages]: {}
  },
  mutations,
  actions,
  getters
}

export default sourcesModule

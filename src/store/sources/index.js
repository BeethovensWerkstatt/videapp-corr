import mutations, { mutationsNames } from './mutations'
import actions, { actionNames } from './actions'
import getters, { getterNames } from './getters'

export const sourcesNames = {
  state: {
    movements: 'movements',
    sources: 'sources',
    activeSourceId: 'activeSourceId',
    page: 'pages'
  },
  mutations: mutationsNames,
  actions: actionNames,
  getters: getterNames
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

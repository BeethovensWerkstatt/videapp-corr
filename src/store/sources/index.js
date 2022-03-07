import { sourcesNames } from './names'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// TODO compareSources
// TODO compareMovements
// TODO comparePages?

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

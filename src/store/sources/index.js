import n from '@/store/names'
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
    [n.state.movements]: {},
    [n.state.sources]: [],
    [n.state.activeSourceId]: null,
    [n.state.pages]: {}
  },
  mutations,
  actions,
  getters
}

export default sourcesModule

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import { registerMutations, registerActions } from '../names'

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
    movements: {},
    sources: [],
    activeSourceId: null,
    pages: {}
  },
  mutations,
  actions,
  getters
}

registerMutations(sourcesModule.mutations)
registerActions(sourcesModule.actions)

export default sourcesModule

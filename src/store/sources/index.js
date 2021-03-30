import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import { registerMutations, registerActions } from '../names'

const toStore = {
  state: {
    movements: {},
    sources: [],
    activeSourceId: null
  },
  mutations,
  actions,
  getters
}

registerMutations(toStore.mutations)
registerActions(toStore.actions)

export default toStore

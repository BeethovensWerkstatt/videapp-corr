import { registerMutations, registerActions } from '../names'

const relationsModule = {
  state: {
    works: {},
    movements: {},
    sources: {},
    pages: {},
    measures: {},
    complaints: {}
  },
  mutations: {
    REGISTER_SOURCE (state, { workId, movementId, sourceId }) {
      let work = state.works[workId]
      if (!work) {
        work = { id: workId }
      }
    }
  },
  actions: {},
  getters: {}
}

registerMutations(relationsModule.mutations)
registerActions(relationsModule.actions)

export default relationsModule

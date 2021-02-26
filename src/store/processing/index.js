import { registerMutations, registerActions } from '../names'

const toStore = {
  state: {
    working: 0
  },
  mutations: {
    SET_WORKING (state, act) {
      // console.log('set working: ' + act)
      state.working += act ? 1 : -1
      console.log(Promise)
    }
  },
  actions: {
  },
  getters: {
    working (state) {
      // console.log('working ' + state.working)
      return state.working > 0
    }
  }
}

registerMutations(toStore.mutations)
registerActions(toStore.actions)

export default toStore

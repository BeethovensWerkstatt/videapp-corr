import { runtimeNames } from './names'

const runtimeModule = {
  state: {
    [runtimeNames.state.working]: 0,
    [runtimeNames.state.modals]: []
  },
  mutations: {
    /**
     * add or remove working process
     * @memberof store.processing.mutations
     * @param {Boolean} act if true increase working number, else decrease
     */
    [runtimeNames.mutations.SET_WORKING] (state, act) {
      // console.log('set working: ' + act)
      state.working += act ? 1 : -1
    },
    [runtimeNames.mutations.ADD_MODAL] (state, key) {
      const modals = [...state.modals.filter(m => m !== key)]
      modals.push(key)
      state.modals = modals
    },
    [runtimeNames.mutations.REM_MODAL] (state, key) {
      const modals = [...state.modals.filter(m => m !== key)]
      state.modals = modals
    }
  },
  actions: {},
  getters: {
    [runtimeNames.getters.working]: (state) => (state.working > 0),
    [runtimeNames.getters.modals]: (state) => state.modals,
    [runtimeNames.getters.modalsOpen]: (state) => state.modals.length
  }
}

export default runtimeModule

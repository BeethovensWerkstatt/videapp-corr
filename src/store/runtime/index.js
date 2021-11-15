
export const runtimeNames = {
  state: {
    modals: 'modals'
  },
  mutations: {
    ADD_MODAL: 'ADD_MODAL',
    REM_MODAL: 'REM_MODAL'
  },
  actions: {},
  getters: {
    modals: 'modals',
    modalsOpen: 'modalsOpen'
  }
}

const runtimeModule = {
  state: {
    [runtimeNames.state.modals]: []
  },
  mutations: {
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
    [runtimeNames.getters.modals]: (state) => state.modals,
    [runtimeNames.getters.modalsOpen]: (state) => state.modals.length
  }
}

export default runtimeModule

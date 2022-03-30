import n from '@/store/names'
import config from '@/config'

const runtimeModule = {
  state: {
    [n.state.working]: 0,
    [n.state.modals]: [],
    [n.state.mainbranch]: config.mainbranch
  },
  mutations: {
    /**
     * add or remove working process
     * @memberof store.processing.mutations
     * @param {Boolean} act if true increase working number, else decrease
     */
    [n.mutations.SET_WORKING] (state, act) {
      // console.log('set working: ' + act)
      state.working += act ? 1 : -1
    },
    [n.mutations.ADD_MODAL] (state, key) {
      const modals = [...state.modals.filter(m => m !== key)]
      modals.push(key)
      state.modals = modals
    },
    [n.mutations.REM_MODAL] (state, key) {
      const modals = [...state.modals.filter(m => m !== key)]
      state.modals = modals
    }
  },
  actions: {},
  getters: {
    [n.getters.working]: (state) => (state.working > 0),
    [n.getters.modals]: (state) => state.modals,
    [n.getters.modalsOpen]: (state) => state.modals.length,
    [n.getters.mainbranch]: (state) => state.mainbranch
  }
}

export default runtimeModule

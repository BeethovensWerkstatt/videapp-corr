import { registerMutations, registerActions } from '../names'

/**
 * @namespace store.processing
 */
const processingModule = {
  /**
   * @namespace store.processing.state
   * @property {Number} working number of working background processes
   */
  state: {
    working: 0
  },
  /**
   * @namespace store.processing.mutations
   */
  mutations: {
    /**
     * add or remove working process
     * @memberof store.processing.mutations
     * @param {Boolean} act if true increase working number, else decrease
     */
    SET_WORKING (state, act) {
      // console.log('set working: ' + act)
      state.working += act ? 1 : -1
    }
  },
  actions: {
  },
  /**
   * @namespace store.processing.getters
   * @property {Boolean} working true if number of working processes > 0
   */
  getters: {
    working (state) {
      // console.log('working ' + state.working)
      return state.working > 0
    }
  }
}

registerMutations(processingModule.mutations)
registerActions(processingModule.actions)

export default processingModule

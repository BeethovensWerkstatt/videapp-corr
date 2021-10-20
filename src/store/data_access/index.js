import PouchDB from 'pouchdb'
import { registerActions, registerMutations } from '../names'
// import axios from 'axios'

export const pouchDbName = 'axios-data'

/**
 * @namespace store.data_access
 */
const DAmodule = {
  /**
   * @namespace store.data_access.state
   */
  state: {
    db: null
  },
  /**
   * @namespace store.data_access.mutations
   */
  mutations: {
    CREATE_POUCHDB (state) {
      state.db = new PouchDB(pouchDbName)
    }
  },
  /**
   * @namespace store.data_access.actions
   */
  actions: {},
  /**
   * @namespace store.data_access.getters
   */
  getters: {}
}

// console.log(registerActions)
registerMutations(DAmodule.mutations)
registerActions(DAmodule.actions)
// console.log(actions)

export default DAmodule

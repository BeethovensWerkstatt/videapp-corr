import PouchDB from 'pouchdb'
import axios from 'axios'
import config from '@/config'

export const DAnames = {
  state: {
    db: 'db'
  },
  mutations: {
    CDB_STORE_DATA: 'CDB_STORE_DATA'
  },
  actions: {
    getData: 'getData'
  },
  getters: {}
}

/**
 * @namespace store.data_access
 */
const DAmodule = {
  /**
   * @namespace store.data_access.state
   */
  state: {
    [DAnames.state.db]: new PouchDB(config.couchdb.defaultName)
  },
  /**
   * @namespace store.data_access.mutations
   */
  mutations: {
    [DAnames.mutations.CDB_STORE_DATA] (state, { _id, data }) {
      state.db.put({ _id, data })
    }
  },
  /**
   * @namespace store.data_access.actions
   */
  actions: {
    [DAnames.actions.getData] ({ state, commit }, { url, callback, error }) {
      // first try pouchdb (indexedDB)
      state.db.get(url).then(d => {
        // TODO refetch data on TTL
        callback(d)
      }).catch((err) => {
        console.debug(err)
        // if db fetch fails try axios
        axios.get(url).then(({ data }) => {
          const d = {
            _id: url,
            data
          }
          // store data in db
          commit(DAnames.mutations.CDB_STORE_DATA, d)
          // send data back
          callback(d)
        }).catch(err => {
          if (error) {
            error(err)
          } else {
            console.error(err)
          }
        })
      })
    }
  },
  /**
   * @namespace store.data_access.getters
   */
  getters: {}
}

export default DAmodule

import PouchDB from 'pouchdb'
import axios from 'axios'
import config from '@/config'
import n from '@/store/names'

/**
 * @namespace store.data_access
 */
const DAmodule = {
  /**
   * @namespace store.data_access.state
   */
  state: {
    [n.state.db]: new PouchDB(config.couchdb.defaultName)
  },
  /**
   * @namespace store.data_access.mutations
   */
  mutations: {
    [n.mutations.CDB_STORE_DATA] (state, { _id, data }) {
      state.db.put({ _id, data })
    }
  },
  /**
   * @namespace store.data_access.actions
   */
  actions: {
    [n.actions.getData] ({ state, commit }, { url, callback, error }) {
      // first try pouchdb (indexedDB)
      // state.db.get(url).then(d => {
      //   TODO refetch data on TTL
      //   callback(d)
      // }).catch((err) => {

      // console.debug(err)
      // if db fetch fails try axios
      console.log('load ' + url + '...')
      axios.get(url).then(({ data }) => {
        const type = typeof data
        /*
        switch (type) {
          case 'string': break
          case 'object': data = JSON.stringify; break
          default: data = data.toString()
        }
        */
        const d = {
          _id: url,
          type,
          data
        }
        // store data in db
        // commit(n.mutations.CDB_STORE_DATA, d)
        // send data back
        console.log('loaded ' + url + ' of type ' + type)
        callback(d)
      }).catch(err => {
        if (error) {
          error(err)
        } else {
          console.error(err)
        }
      })
      // })
    }
  },
  /**
   * @namespace store.data_access.getters
   */
  getters: {}
}

export default DAmodule

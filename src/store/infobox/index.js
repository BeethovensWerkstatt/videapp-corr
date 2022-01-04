import axios from 'axios'
import { startProc, finishProc } from '..'
import n from '@/store/names'

/**
 * @namespace store.infobox
 */
const infoboxmodule = {
  /**
   * @namespace store.infobox.state
   * @property {String} currentItem ID of the currently highlighted element
   */
  state: {
    [n.state.currentItem]: ''
  },
  /**
   * @namespace store.infobox.mutations
   */
  mutations: {
    /**
     * set current item for infobox
     * @memberof store.infobox.mutations
     * @param {String} item
     */
    [n.mutations.SET_CURRENT_ITEM] (state, item) {
      state.currentItem = item
    },
    [n.mutations.CANCEL_CURRENT_ITEM] (state) {
      state.currentItem = null
    }
  },
  /**
   * @namespace store.infobox.actions
   */
  actions: {
    /**
     * set current item for infobox
     * @memberof store.infobox.actions
     */
    async [n.actions.setCurrentItem] ({ commit }, payload) {
      if (payload === null) {
        return
      }
      startProc()
      try {
        // const uri = 'http://localhost:8080/exist/apps/api/desc/' + payload + '.json'
        const uri = 'https://api.beethovens-werkstatt.de/desc/' + payload + '.json'
        const res = await axios.get(uri)
        const json = await res.data
        commit(n.mutations.SET_CURRENT_ITEM, json)
      } finally {
        finishProc()
      }
    },
    [n.actions.cancelCurrentItem] ({ commit }) {
      commit(n.mutations.CANCEL_CURRENT_ITEM)
    }
  },
  /**
   * @namespace store.infobox.getters
   * @property {Boolean} visible Infobox is rendrered
   * @property {String} currentItem currently displayed Item in infobox
   */
  getters: {
    [n.getters.visible]: (state) => {
      return state.currentItem !== ''
    },
    [n.getters.currentItem]: (state) => {
      return state.currentItem
    },
    [n.getters.hasCurrentItem]: (state) => {
      return !!state.currentItem
    }
  }
}

export default infoboxmodule

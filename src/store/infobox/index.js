
export const Infoboxnames = {
  state: {
    currentItem: 'currentItem'
  },
  mutations: {
    SET_CURRENT_ITEM: 'SET_CURRENT_ITEM'
  },
  actions: {
    setCurrentItem: 'setCurrentItem'
  },
  getters: {
    visible: 'visible',
    currentItem: 'currentItem'
  }
}

/**
 * @namespace store.infobox
 */
const Infoboxmodule = {
  /**
   * @namespace store.infobox.state
   * @property {String} currentItem ID of the currently highlighted element
   */
  state: {
    [Infoboxnames.state.currentItem]: ''
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
    [Infoboxnames.mutations.SET_CURRENT_ITEM] (state, item) {
      state.currentItem = item
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
    [Infoboxnames.actions.setCurrentItem] ({ commit }, payload) {
      console.log(payload)
      commit(Infoboxnames.mutations.SET_CURRENT_ITEM, payload)
      console.log('me here, after payload')
      // console.log(state)
    }
  },
  /**
   * @namespace store.infobox.getters
   * @property {Boolean} visible Infobox is rendrered
   * @property {String} currentItem currently displayed Item in infobox
   */
  getters: {
    [Infoboxnames.getters.visible]: (state) => {
      return state.currentItem !== ''
    },
    [Infoboxnames.getters.currentItem]: (state) => {
      return state.currentItem
    }
  }
}

export default Infoboxmodule

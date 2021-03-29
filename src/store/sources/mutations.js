const mutations = {
  /**
   * set load source
   * @memberof store.mutations
   * @param {object} state
   * @param {object} source - (*TBD typedef source object*)
   */
  LOAD_SOURCE (state, source) {
    const sources = [...state.sources]
    // console.log(source)
    sources.push(source)
    state.sources = sources
  },
  /**
   * replace source
   * @memberof store.mutations
   * @param {object} state
   * @param {object} source - properties to modify with id
   */
  MODIFY_SOURCE (state, source) {
    state.sources = state.sources.map(src => {
      if (src.id === source.id) {
        return { ...src, ...source }
      } else {
        return src
      }
    })
  },
  /**
   * move source on the OSD space
   * @memberof store.mutations
   * @param {object} state
   * @param {object} src
   */
  MOVE_SOURCE (state, { id, x, y }) {
    // console.log('move source ' + id + ': ' + x + ',' + y)
    const msrc = { ...state.sources.find(src => src.id === id), position: { x: x, y: y } }
    if (msrc.id) {
      state.sources = state.sources.map(src => src.id === msrc.id ? msrc : src)
    }
  },
  /**
   * open page pair (recto/verso)
   * @memberof store.mutations
   * @param {Object} state
   * @param {Object} payload id: String, page: Number
   */
  SET_PAGE (state, { id, page }) {
    const msrc = { ...state.sources.find(src => src.id === id), pagenr: page }
    if (msrc.id) {
      state.sources = state.sources.map(src => src.id === msrc.id ? msrc : src)
    }
  },
  /**
   * set active source component
   * @memberof store.mutations
   * @param {object} state
   * @param {String} src source id
   */
  ACTIVATE_SOURCE (state, src) {
    state.activeSourceId = src
  }
}

export default mutations

import { sourceMutationNames } from './names'

/**
 * @namespace store.sources.mutations
 */
const mutations = {
  /**
   * set load source
   * @memberof store.sources.mutations
   * @param {object} source - (*TBD typedef source object*)
   */
  [sourceMutationNames.LOAD_SOURCE] (state, source) {
    const sources = [...state.sources]
    // console.log(source)
    sources.push(source)
    state.sources = sources
  },
  /**
   * @memberof store.sources.mutations
   * @param {Object} movement
   */
  [sourceMutationNames.LOAD_MOVEMENT] (state, movement) {
    const movements = { ...state.movements }
    movements[movement['@id']] = movement
    state.movements = movements
    // console.log(state.movements)
  },
  /**
   * replace source
   * @memberof store.sources.mutations
   * @param {object} source - properties to modify with id
   */
  [sourceMutationNames.MODIFY_SOURCE] (state, source) {
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
   * @memberof store.sources.mutations
   * @param {object} src
   */
  [sourceMutationNames.MOVE_SOURCE] (state, { id, x, y }) {
    // console.log('move source ' + id + ': ' + x + ',' + y)
    const msrc = { ...state.sources.find(src => src.id === id), position: { x: x, y: y } }
    if (msrc.id) {
      state.sources = state.sources.map(src => src.id === msrc.id ? msrc : src)
    }
  },
  /**
   * open select page dialog
   * @param {string} id
   */
  SET_SELECT_PAGE_ID: (state, id) => { state.selectPageId = id },
  /**
   * open page pair (recto/verso)
   * @memberof store.sources.mutations
   * @param {Object} payload id: String, page: Number
   */
  [sourceMutationNames.SET_PAGE] (state, { id, page }) {
    const msrc = { ...state.sources.find(src => src.id === id), pagenr: page }
    if (msrc.id) {
      state.sources = state.sources.map(src => src.id === msrc.id ? msrc : src)
    }
  },
  /**
   * set active source component
   * @memberof store.sources.mutations
   * @param {String} src source id
   */
  [sourceMutationNames.ACTIVATE_SOURCE] (state, src) {
    state.activeSourceId = src
  }
}

export default mutations

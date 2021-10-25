import { registerMutations, registerActions } from '../names'

/**
 * @namespace store.userDisplayOptions
 */
const userDisplayOptions = {
  /**
   * @namespace store.userDisplayOptions.state
   * @property {Boolean} displayMeasures if true show measure frames
   */
  state: {
    sourceHorizontalGap: 10, // mm
    sourceVerticalGap: 50, // mm
    sourceHeaderHeight: 20, // mm
    sourceMarginWidth: 25, // mm
    sourceMarkerHeight: 15, // mm
    displayMeasures: false,
    complaintFacsimileAspect: '16 / 9',
    complaintDisplaySelect: {
      dialog: false,
      ante: true,
      rvsn: true,
      post: true,
      facs: true,
      trns: true,
      text: true,
      anno: true
    }
  },
  /**
   * @namespace store.userDisplayOptions.mutations
   */
  mutations: {
    /**
     * set height of source headerbar in millimeter
     * @param {Number} height height of headerbar
     */
    SET_SOURCE_HEADER_HEIGHT (state, height) {
      state.sourceHeaderHeight = height
    },
    /**
     * set width of source margin regions
     * @param {Number} width width of margin bars
     */
    SET_SOURCE_MARGIN_WIDTH (state, width) {
      state.sourceMarginWidth = width
    },
    /**
     * set width of gap between source for automatic alignment
     * @param {Number} gap width of gap
     */
    SET_SOURCE_HORIZONTAL_GAP (state, gap) {
      state.sourceHorizontalGap = gap
    },
    /**
     * set height of gap between source for automatic alignment
     * @param {Number} gap height of gap
     */
    SET_SOURCE_VERTICAL_GAP (state, gap) {
      state.sourceVerticalGap = gap
    },
    /**
     * toggle display of measure numbers
     * @memberof store.osd.mutations
     * @param {Boolean} display set displayMeasures flag
     */
    SET_DISPLAY_MEASURES (state, display) {
      state.displayMeasures = display
    },
    /**
     * set default selected views in complaint dialog
     * @param {Object} payload properties ante, rvsn, post, facs, trns, text, anno
     */
    SET_COMPLAINT_DISPLAY_SELECT (state, payload) {
      const select = { ...state.complaintDisplaySelect }
      const keys = Object.keys(select)
      for (const k of keys) {
        if (payload[k] !== undefined) {
          select[k] = !!payload[k]
        }
      }
      state.complaintDisplaySelect = select
    },
    /**
     * @param {String} aspect ratio like '16 / 9'
     */
    SET_COMPLAINT_FACSIMILE_ASPECT (state, aspect) {
      state.complaintFacsimileAspect = aspect
    }
  },
  /**
   * @namespace store.userDisplayOptions.actions
   */
  actions: {
  },
  /**
   * @namespace store.userDisplayOptions.getters
   * @property {Boolean} displayMeasures if true show measure frames
   */
  getters: {
    sourceHeaderHeight: (state) => state.sourceHeaderHeight,
    sourceMarginWidth: (state) => state.sourceMarginWidth,
    sourceHorizontalGap: (state) => state.sourceHorizontalGap,
    sourceVerticalGap: (state) => state.sourceVerticalGap,
    sourceMarkerHeight: (state) => state.sourceMarkerHeight,
    displayMeasures: (state) => state.displayMeasures,
    complaintFacsimileAspect: (state) => state.complaintFacsimileAspect,
    complaintDisplaySelect: (state) => state.complaintDisplaySelect
  }
}

registerMutations(userDisplayOptions.mutations)
registerActions(userDisplayOptions.actions)

export default userDisplayOptions

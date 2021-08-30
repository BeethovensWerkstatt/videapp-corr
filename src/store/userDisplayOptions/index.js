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
    displayMeasures: false
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
    sourceHeaderHeight (state) {
      return state.sourceHeaderHeight
    },
    sourceMarginWidth (state) {
      return state.sourceMarginWidth
    },
    sourceHorizontalGap (state) {
      return state.sourceHorizontalGap
    },
    sourceVerticalGap (state) {
      return state.sourceVerticalGap
    },
    displayMeasures: (state) => {
      return state.displayMeasures
    }
  }
}

registerMutations(userDisplayOptions.mutations)
registerActions(userDisplayOptions.actions)

export default userDisplayOptions

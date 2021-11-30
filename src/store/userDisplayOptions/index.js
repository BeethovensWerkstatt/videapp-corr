export const optionNames = {
  state: {
    sourceHorizontalGap: 'sourceHorizontalGap',
    sourceVerticalGap: 'sourceVerticalGap',
    sourceHeaderHeight: 'sourceHeaderHeight',
    sourceMarginWidth: 'sourceMarginWidth',
    sourceMarkerHeight: 'sourceMarkerHeight',
    displayMeasures: 'displayMeasures',
    complaintFacsimileAspect: 'complaintFacsimileAspect',
    complaintDisplaySelect: 'complaintDisplaySelect'
  },
  mutations: {
    SET_SOURCE_HEADER_HEIGHT: 'SET_SOURCE_HEADER_HEIGHT',
    SET_SOURCE_MARGIN_WIDTH: 'SET_SOURCE_MARGIN_WIDTH',
    SET_SOURCE_HORIZONTAL_GAP: 'SET_SOURCE_HORIZONTAL_GAP',
    SET_SOURCE_VERTICAL_GAP: 'SET_SOURCE_VERTICAL_GAP',
    SET_DISPLAY_MEASURES: 'SET_DISPLAY_MEASURES',
    SET_COMPLAINT_DISPLAY_SELECT: 'SET_COMPLAINT_DISPLAY_SELECT',
    SET_COMPLAINT_FACSIMILE_ASPECT: 'SET_COMPLAINT_FACSIMILE_ASPECT'
  },
  actions: {},
  getters: {
    sourceHeaderHeight: 'sourceHeaderHeight',
    sourceMarginWidth: 'sourceMarginWidth',
    sourceHorizontalGap: 'sourceHorizontalGap',
    sourceVerticalGap: 'sourceVerticalGap',
    sourceMarkerHeight: 'sourceMarkerHeight',
    displayMeasures: 'displayMeasures',
    complaintFacsimileAspect: 'complaintFacsimileAspect',
    complaintDisplaySelect: 'complaintDisplaySelect'
  }
}

/**
 * @namespace store.userDisplayOptions
 */
const userDisplayOptions = {
  /**
   * @namespace store.userDisplayOptions.state
   * @property {Boolean} displayMeasures if true show measure frames
   */
  state: {
    [optionNames.state.sourceHorizontalGap]: 10, // mm
    [optionNames.state.sourceVerticalGap]: 50, // mm
    [optionNames.state.sourceHeaderHeight]: 20, // mm
    [optionNames.state.sourceMarginWidth]: 25, // mm
    [optionNames.state.sourceMarkerHeight]: 15, // mm
    [optionNames.state.displayMeasures]: false,
    [optionNames.state.complaintFacsimileAspect]: '16 / 9',
    [optionNames.state.complaintDisplaySelect]: {
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
    [optionNames.mutations.SET_SOURCE_HEADER_HEIGHT]: (state, height) => {
      state.sourceHeaderHeight = height
    },
    /**
     * set width of source margin regions
     * @param {Number} width width of margin bars
     */
    [optionNames.mutations.SET_SOURCE_MARGIN_WIDTH]: (state, width) => {
      state.sourceMarginWidth = width
    },
    /**
     * set width of gap between source for automatic alignment
     * @param {Number} gap width of gap
     */
    [optionNames.mutations.SET_SOURCE_HORIZONTAL_GAP]: (state, gap) => {
      state.sourceHorizontalGap = gap
    },
    /**
     * set height of gap between source for automatic alignment
     * @param {Number} gap height of gap
     */
    [optionNames.mutations.SET_SOURCE_VERTICAL_GAP]: (state, gap) => {
      state.sourceVerticalGap = gap
    },
    /**
     * toggle display of measure numbers
     * @memberof store.osd.mutations
     * @param {Boolean} display set displayMeasures flag
     */
    [optionNames.mutations.SET_DISPLAY_MEASURES]: (state, display) => {
      state.displayMeasures = display
    },
    /**
     * set default selected views in complaint dialog
     * @param {Object} payload properties ante, rvsn, post, facs, trns, text, anno
     */
    [optionNames.mutations.SET_COMPLAINT_DISPLAY_SELECT]: (state, payload) => {
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
    [optionNames.mutations.SET_COMPLAINT_FACSIMILE_ASPECT]: (state, aspect) => {
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
    [optionNames.getters.sourceHeaderHeight]: (state) => state.sourceHeaderHeight,
    [optionNames.getters.sourceMarginWidth]: (state) => state.sourceMarginWidth,
    [optionNames.getters.sourceHorizontalGap]: (state) => state.sourceHorizontalGap,
    [optionNames.getters.sourceVerticalGap]: (state) => state.sourceVerticalGap,
    [optionNames.getters.sourceMarkerHeight]: (state) => state.sourceMarkerHeight,
    [optionNames.getters.displayMeasures]: (state) => state.displayMeasures,
    [optionNames.getters.complaintFacsimileAspect]: (state) => state.complaintFacsimileAspect,
    [optionNames.getters.complaintDisplaySelect]: (state) => state.complaintDisplaySelect
  }
}

export default userDisplayOptions

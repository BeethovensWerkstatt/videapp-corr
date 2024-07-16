export const optionNames = {
  state: {
    sourceHorizontalGap: 'sourceHorizontalGap',
    sourceVerticalGap: 'sourceVerticalGap',
    sourceHeaderHeight: 'sourceHeaderHeight',
    sourceFooterHeight: 'sourceFooterHeight',
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
    sourceFooterHeight: 'sourceFooterHeight',
    sourceMarginWidth: 'sourceMarginWidth',
    sourceHorizontalGap: 'sourceHorizontalGap',
    sourceVerticalGap: 'sourceVerticalGap',
    sourceMarkerHeight: 'sourceMarkerHeight',
    displayMeasures: 'displayMeasures',
    complaintFacsimileAspect: 'complaintFacsimileAspect',
    complaintDisplaySelect: 'complaintDisplaySelect'
  }
}

export default optionNames

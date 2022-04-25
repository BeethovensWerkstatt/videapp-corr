import n from '@/store/names'

/**
 * @namespace store.complaints.mutations
 */
const mutations = {
  /**
   * display complaints list dialog
   * @param {Object} state
   * @param {Boolean} show
   */
  [n.mutations.COMPLAINTS_LIST] (state, show) {
    state.showComplaintsList = show
  },
  /**
   * load complaint
   * @memberof store.complaints.mutations
   * @param {Object} state
   * @param {Object} complaint
   */
  [n.mutations.LOAD_COMPLAINT] (state, complaint) {
    const complaints = [...state.complaints]
    complaints.push(complaint)
    state.complaints = complaints
  },
  /**
   * replace complaint
   * @memberof store.complaints.mutations
   * @param {Object} state
   * @param {Object} complaint
   */
  [n.mutations.MODIFY_COMPLAINT] (state, complaint) {
    let success = false
    const complaints = state.complaints.map(c => {
      if (c['@id'] === complaint['@id']) {
        success = true
        return complaint
      }
      return c
    })
    if (!success) {
      complaints.push(complaint)
    }
    state.complaints = complaints
  },
  /**
   * activate complaint
   * @param {Object} state
   * @param {String} complaintId
   */
  [n.mutations.ACTIVATE_COMPLAINT] (state, complaintId) {
    state.activeComplaintId = complaintId
  },
  /**
   * display complaint
   * @param {Object} state
   * @param {Boolean} display
   */
  [n.mutations.DISPLAY_COMPLAINT] (state, display) {
    state.displayComplaint = display
  },
  /**
   * display filter dialog for filter category tag
   * @param {Object} state
   * @param {String} tag
   */
  [n.mutations.DISPLAY_FILTER_DIALOG] (state, tag) {
    state[n.state.complaintFilterDialog] = tag
  },
  /**
   * set filter select
   */
  [n.mutations.SET_FILTER_SELECT] (state, { tag, key, val }) {
    const filterSelect = state.filterSelect
    const tagSel = filterSelect[tag]
    // console.log(tag, key, val)
    if (val) {
      filterSelect[tag] = {
        ...tagSel,
        [key]: true
      }
    } else if (tagSel) {
      delete tagSel[key]
    }
    state.filterSelect = filterSelect
    // console.log(state.filterSelect)
  },
  /**
   * set filter function
   * @param {Function} parms { tag, filter }
   */
  [n.mutations.SET_FILTER] (state, { tag, filter }) {
    // console.log(tag, filter)
    state[n.state.complaintFilter] = {
      ...state[n.state.complaintFilter],
      [tag]: filter
    }
  },
  /**
   * remove filter function
   * @param {Function} parms tag
   */
  [n.mutations.REM_FILTER] (state, { tag, callback }) {
    if (typeof callback === 'function') {
      const filter = state[n.state.complaintFilter][tag]
      callback(tag, filter)
    }
    delete state[n.state.complaintFilter][tag]
  },
  /**
   * set sort function
   * @param {Object} parms { sortedBy, sorter }
   */
  [n.mutations.SET_SORTER] (state, { sortedBy, sorter, toggle }) {
    // console.log(sortedBy, toggle)
    if (toggle) {
      state[n.state.sortReverse] = !state[n.state.sortReverse]
    } else if (state[n.state.sortedBy] !== sortedBy) {
      state[n.state.sortReverse] = false
    }
    state[n.state.sortedBy] = sortedBy
    state[n.state.complaintSorter] = sorter
  }
}

export default mutations

import axios from 'axios'
import { startProc, finishProc } from '..'
import n from '@/store/names'
import tb from '@/toolbox'
// import Complaint from '@/data/Complaint'

// TODO filter & sort complaint list in extra state property

export const complaintFilterTags = {
  objects: [
    'bw_object_dynamic',
    'bw_object_pitch',
    'bw_object_bogensetzung',
    'bw_object_rhythm',
    'bw_object_ornament',
    'bw_object_octave',
    'bw_object_pedal',
    'bw_object_articulation',
    'bw_object_clef',
    'bw_object_arpeggio',
    'bw_object_rest',
    'bw_object_fingering'
  ],
  operation: [
    'bw_textoperation_einfuegung',
    'bw_textoperation_tilgung',
    'bw_textoperation_ersetzung',
    'bw_textoperation_umstellung'
  ],
  classes: [
    'bw_classification_korrektur',
    'bw_classification_variante',
    'bw_classification_textpraezisierung',
    'bw_classification_schriftbildliche_verbesserung',
    'bw_classification_paratextliche_eingriffe'
  ],
  context: [
    'bw_kontext_korrekt',
    'bw_kontext_unvollstaendig',
    'bw_kontext_korrumpiert'
  ],
  implementation: [
    'bw_fully_implemented',
    'bw_partially_implemented',
    'bw_not_implemented'
  ]
}

/**
 * @namespace store.complaints
 */
const complaintsModule = {
  /**
   * @namespace store.complaints.state
   * @property {Object[]} complaints - list of loaded complaints
   * @property {String} activeComplaintId - ID of complaint to display
   */
  state: {
    [n.state.showComplaintsList]: false,
    [n.state.complaints]: [],
    [n.state.activeComplaintId]: null,
    [n.state.displayComplaint]: false,
    [n.state.complaintFilter]: [],
    [n.state.sortedBy]: null,
    [n.state.sortReverse]: false,
    [n.state.complaintSorter]: null,
    [n.state.filterSelect]: {}
  },
  /**
   * @namespace store.complaints.mutations
   */
  mutations: {
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
     * set filter select
     */
    [n.mutations.SET_FILTER_SELECT] (state, { tag, key, val }) {
      const filterSelect = state.filterSelect
      const tagSel = filterSelect[tag]
      console.log(tag, key, val)
      if (val) {
        filterSelect[tag] = {
          ...tagSel,
          [key]: true
        }
      } else if (tagSel) {
        delete tagSel[key]
      }
      state.filterSelect = filterSelect
      console.log(state.filterSelect)
    },
    /**
     * set filter function
     * @param {Function} parms { tag, filter }
     */
    [n.mutations.SET_FILTER] (state, { tag, filter }) {
      console.log(tag, filter)
      state[n.state.complaintFilter] = {
        ...state[n.state.complaintFilter],
        [tag]: filter
      }
    },
    /**
     * remove filter function
     * @param {Function} parms tag
     */
    [n.mutations.REM_FILTER] (state, tag) {
      delete state[n.state.complaintFilter][tag]
    },
    /**
     * set sort function
     * @param {Object} parms { sortedBy, sorter }
     */
    [n.mutations.SET_SORTER] (state, { sortedBy, sorter }) {
      if (state[n.state.sortedBy] === sortedBy) {
        state[n.state.sortReverse] = !state[n.state.sortReverse]
        // console.log('sort', sortedBy, state[n.state.sortReverse])
      } else {
        state[n.state.sortedBy] = sortedBy
        state[n.state.sortReverse] = false
      }
      state[n.state.complaintSorter] = sorter
    }
  },
  /**
   * @namespace store.complaints.actions
   */
  actions: {
    /**
     * load complaints
     * @memberof store.complaints.actions
     * @param {Object} payload object containing complaints property `{ complaints: Object[] }`
     */
    [n.actions.loadComplaints] ({ commit, /* dispatch, */ getters }, { complaints }) {
      complaints.forEach(c => {
        // console.log(c)
        const mdiv = c.affects[0]?.mdiv
        // console.log(state.movements, mdiv)
        const movement = mdiv ? getters.movements[mdiv] : undefined
        // TODO this looks like a workaround
        const complaint = movement ? { ...c, movement } : { ...c }
        // console.log(complaint)
        /*
        dispatch(act.getData, {
          url: complaint['@id'],
          callback ({ data }) {
            const c = { ...data, ...complaint }
            commit(mut.LOAD_COMPLAINT, c)
          },
          error (error) {
            console.error(error)
          }
        })
        */
        commit(n.mutations.LOAD_COMPLAINT, complaint)
      })
    },
    /**
     * load complaints
     * @memberof store.complaints.actions
     * @param {String} complaintId id of complaint to activate
     */
    async [n.actions.activateComplaint] ({ dispatch, commit, state }, complaintId) {
      // console.log('activate ' + complaintId)
      if (!complaintId) {
        commit(n.mutations.ACTIVATE_COMPLAINT)
        commit(n.mutations.CANCEL_CURRENT_ITEM)
        return
      }
      console.log(complaintId, state.activeComplaintId)
      if (complaintId !== state.activeComplaintId) {
        commit(n.mutations.CANCEL_CURRENT_ITEM)
      }
      const complaint = state.complaints.find(c => {
        const IdIsURL = complaintId.endsWith('.json')

        if (IdIsURL) {
          return c['@id'] === complaintId
        } else {
          return c['@id'].endsWith('/' + complaintId + '.json')
        }
      })
      if (!complaint) {
        console.error('complaint not found!', complaintId)
        return
      }
      if (!complaint.loading) {
        const callback = (complaint) => commit(n.mutations.ACTIVATE_COMPLAINT, complaint['@id'])
        dispatch(n.actions.loadComplaint, { complaint, callback })
      } else {
        commit(n.mutations.ACTIVATE_COMPLAINT, complaint['@id'])
      }
    },
    [n.actions.activateSibling] ({ commit, dispatch, getters }, previous) {
      // Next Complaint ID to activate
      const ncid = getters[previous ? n.getters.previousComplaintId : n.getters.nextComplaintId]
      if (ncid) {
        dispatch(n.actions.openComplaintComparison, ncid)
      }
    },
    async [n.actions.loadComplaint] ({ commit }, { complaint, callback }) {
      if (!complaint.revisionDocs && complaint['@id']) {
        startProc()
        complaint.loading = true
        // console.log(complaint)
        try {
          const { data } = await axios.get(complaint['@id'])
          complaint = { ...data, ...complaint }
          // console.log(data.tags, complaint.tags)
          complaint.tags = data.tags
          complaint.loading = false
          // console.log(complaint)
          commit(n.mutations.MODIFY_COMPLAINT, complaint)
        } finally {
          finishProc()
        }
      }
      if (typeof callback === 'function') {
        callback(complaint)
      }
    },
    async [n.actions.openComplaintComparison] ({ dispatch, commit, state }, complaintId) {
      if (complaintId === null) {
        return null
      }

      const complaint = state.complaints.find(c => {
        const IdIsURL = complaintId.endsWith('.json')

        if (IdIsURL) {
          return c['@id'] === complaintId
        } else {
          return c['@id'].endsWith('/' + complaintId + '.json')
        }
      })

      if (complaint === null) {
        console.log('Unable to find complaint from ID ' + complaintId)
        return null
      }

      const f = () => {
        if (complaintId !== state.activeComplaintId) {
          commit(n.mutations.CANCEL_CURRENT_ITEM)
        }
        commit(n.mutations.ACTIVATE_COMPLAINT, complaintId)
        commit(n.mutations.DISPLAY_COMPLAINT, true)
      }
      dispatch(n.actions.loadComplaint, { complaint, callback: f })
    }
  },
  /**
   * @namespace store.complaints.getters
   * @property {Object[]} complaints array of complaints
   * @property {String} activeComplaintId id of displayed complaint
   * @property {Object} activeComplaint displayed complaint
   */
  getters: {
    [n.getters.showComplaintsList]: (state) => state.showComplaintsList,
    [n.getters.allComplaints]: (state, getters) => {
      const complaints = state.complaints.map(c => {
        const mdiv = c.affects[0]?.mdiv
        const movement = getters[n.getters.getMovementById](mdiv)
        // console.log(mdiv, movement)
        return { ...c, movement }
      })
      return complaints
    },
    [n.getters.complaints]: (state, getters) => {
      // TODO keep filtered and sorted list in state !!
      const complaintFilter = state[n.state.complaintFilter]
      const filters = complaintFilter ? Object.values(complaintFilter).filter((f) => typeof f === 'function') : []
      // console.log(complaintFilter, filters)
      const complaints = filters.length > 0 ? state.complaints.filter((c) => {
        for (const f of filters) {
          // console.log(f)
          if (!f(c)) {
            return false
          }
        }
        return true
      }) : state.complaints
      const complaintlist = complaints.map(c => {
        const mdiv = c.affects[0]?.mdiv
        const movement = getters.getMovementById(mdiv)
        // console.log(mdiv, movement)
        return { ...c, movement }
      }).sort(getters[n.getters.complaintSorter])
      return state[n.state.sortReverse] ? complaintlist.reverse() : complaintlist
    },
    [n.getters.workComplaints]: (state, getters) => (workId, filtered = true) => {
      // TODO atId in loadComplaints?
      const f = c => tb.atId(c.movement?.work) === workId
      // console.log(getters.allComplaints)
      if (filtered) {
        return getters.complaints.filter(f)
      }
      return getters.allComplaints.filter(f)
    },
    [n.getters.displayComplaint]: (state) => state.displayComplaint,
    [n.getters.activeComplaintId]: (state) => state.activeComplaintId,
    [n.getters.activeComplaint] (state, getters) {
      const complaintId = getters.activeComplaintId
      // console.log(complaintId)
      if (complaintId) {
        const complaint = state.complaints.find(c => c['@id'] === complaintId)
        // console.log(complaint)
        if (!complaint.movement) {
          const mdiv = complaint.affects[0]?.mdiv
          complaint.movement = getters.getMovementById(mdiv)
        }
        return complaint
      }
      return null
    },
    [n.getters.previousComplaintId] (state, getters) {
      const acid = state[n.state.activeComplaintId]
      if (acid) {
        const complaintIds = getters[n.getters.complaints].map((c) => c['@id'])
        const ncid = tb.findPrevious(complaintIds, (cid) => cid === acid)
        console.log(acid, ncid, complaintIds)
        return ncid
      }
      return undefined
    },
    [n.getters.nextComplaintId] (state, getters) {
      const acid = state[n.state.activeComplaintId]
      const complaintIds = getters[n.getters.complaints].map((c) => c['@id'])
      console.log(acid, complaintIds)
      if (acid) {
        const ncid = tb.findPrevious(complaintIds, (cid) => cid === acid)
        console.log(acid, ncid, complaintIds)
        return ncid
      }
      return complaintIds.length > 0 ? complaintIds[0] : undefined
    },
    [n.getters.filterSelect]: (state) => (tag, key) => {
      const tagSel = state.filterSelect[tag]
      // console.log(tagSel, key)
      return tagSel ? !!tagSel[key] : false
    },
    [n.getters.complaintFilter]: (state) => state[n.state.complaintFilter],
    [n.getters.sortedBy]: (state) => state[n.state.sortedBy],
    [n.getters.sortReverse]: (state) => state[n.state.sortReverse] ? -1 : 1,
    [n.getters.complaintSorter] (state, getters) {
      const complaintSorter = state[n.state.complaintSorter]
      const stdSort = (c1, c2) => {
        // TODO work
        const work1 = c1.movement ? getters.getWork(c1.movement?.work) : undefined
        const work2 = c2.movement ? getters.getWork(c2.movement?.work) : undefined
        if (work1?.title[0].title !== work2?.title[0].title) {
          return work2?.title[0].title.localeCompare(work1?.title[0].title) >= 0 ? -1 : 1
        }
        if (c1.movement?.n !== c2.movement?.n) {
          return c1.movement?.n < c2.movement?.n ? -1 : 1
        }
        const m1 = parseInt(c1.affects[0].measures.label?.match(/\d+/))
        const m2 = parseInt(c2.affects[0].measures.label?.match(/\d+/))
        return m1 <= m2 ? -1 : 1
      }
      const customSort = complaintSorter ? (c1, c2) => {
        const s = complaintSorter(c1, c2)
        return s || stdSort(c1, c2)
      } : stdSort
      return customSort
    }
  }
}

export default complaintsModule

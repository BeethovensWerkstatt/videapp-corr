import axios from 'axios'
import { startProc, finishProc } from '..'
import { complaintsNames } from './names'
import { mutations as mut, actions as act } from '../names'
import tb from '@/toolbox'
// import Complaint from '@/data/Complaint'

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
    [complaintsNames.state.showComplaintsList]: false,
    [complaintsNames.state.complaints]: [],
    [complaintsNames.state.activeComplaintId]: null,
    [complaintsNames.state.displayComplaint]: false,
    [complaintsNames.state.filteredBy]: null,
    [complaintsNames.state.complaintFilter]: null,
    [complaintsNames.state.sortedBy]: null,
    [complaintsNames.state.sortReverse]: false,
    [complaintsNames.state.complaintSorter]: null
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
    [complaintsNames.mutations.COMPLAINTS_LIST] (state, show) {
      state.showComplaintsList = show
    },
    /**
     * load complaint
     * @memberof store.complaints.mutations
     * @param {Object} state
     * @param {Object} complaint
     */
    [complaintsNames.mutations.LOAD_COMPLAINT] (state, complaint) {
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
    [complaintsNames.mutations.MODIFY_COMPLAINT] (state, complaint) {
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
    [complaintsNames.mutations.ACTIVATE_COMPLAINT] (state, complaintId) {
      state.activeComplaintId = complaintId
    },
    /**
     * display complaint
     * @param {Object} state
     * @param {Boolean} display
     */
    [complaintsNames.mutations.DISPLAY_COMPLAINT] (state, display) {
      state.displayComplaint = display
    },
    /**
     * set filter function
     * @param {Function} parms { filteredBy, filter }
     */
    [complaintsNames.mutations.SET_FILTER] (state, { filteredBy, filter }) {
      state[complaintsNames.state.filteredBy] = filteredBy
      state[complaintsNames.state.complaintFilter] = filter
    },
    /**
     * set sort function
     * @param {Object} parms { sortedBy, sorter }
     */
    [complaintsNames.mutations.SET_SORTER] (state, { sortedBy, sorter }) {
      if (state[complaintsNames.state.sortedBy] === sortedBy) {
        state[complaintsNames.state.sortReverse] = !state[complaintsNames.state.sortReverse]
      } else {
        state[complaintsNames.state.sortedBy] = sortedBy
      }
      state[complaintsNames.state.complaintSorter] = sorter
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
    [complaintsNames.actions.loadComplaints] ({ commit, /* dispatch, */ getters }, { complaints }) {
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
        commit(mut.LOAD_COMPLAINT, complaint)
      })
    },
    /**
     * load complaints
     * @memberof store.complaints.actions
     * @param {String} complaintId id of complaint to activate
     */
    async [complaintsNames.actions.activateComplaint] ({ dispatch, commit, state }, complaintId) {
      // console.log('activate ' + complaintId)
      if (!complaintId) {
        commit(mut.ACTIVATE_COMPLAINT)
        commit(mut.CANCEL_CURRENT_ITEM)
        return
      }
      console.log(complaintId, state.activeComplaintId)
      if (complaintId !== state.activeComplaintId) {
        commit(mut.CANCEL_CURRENT_ITEM)
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
        const callback = (complaint) => commit(mut.ACTIVATE_COMPLAINT, complaint['@id'])
        dispatch(act.loadComplaint, { complaint, callback })
      } else {
        commit(complaintsNames.mutations.ACTIVATE_COMPLAINT, complaint['@id'])
      }
    },
    [complaintsNames.actions.activateSibling] ({ commit, dispatch, getters }, previous) {
      // Next Complaint ID to activate
      const ncid = getters[previous ? complaintsNames.getters.previousComplaintId : complaintsNames.getters.nextComplaintId]
      if (ncid) {
        dispatch(complaintsNames.actions.openComplaintComparison, ncid)
      }
    },
    async [complaintsNames.actions.loadComplaint] ({ commit }, { complaint, callback }) {
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
          commit(mut.MODIFY_COMPLAINT, complaint)
        } finally {
          finishProc()
        }
      }
      if (typeof callback === 'function') {
        callback(complaint)
      }
    },
    async [complaintsNames.actions.openComplaintComparison] ({ dispatch, commit, state }, complaintId) {
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
          commit(mut.CANCEL_CURRENT_ITEM)
        }
        commit(complaintsNames.mutations.ACTIVATE_COMPLAINT, complaintId)
        commit(complaintsNames.mutations.DISPLAY_COMPLAINT, true)
      }
      dispatch(complaintsNames.actions.loadComplaint, { complaint, callback: f })
    }
  },
  /**
   * @namespace store.complaints.getters
   * @property {Object[]} complaints array of complaints
   * @property {String} activeComplaintId id of displayed complaint
   * @property {Object} activeComplaint displayed complaint
   */
  getters: {
    [complaintsNames.getters.showComplaintsList]: (state) => state.showComplaintsList,
    [complaintsNames.getters.complaints]: (state, getters) => {
      const complaints = state.complaintFilter ? state.complaints.filter(state.complaintFilter) : state.complaints
      const complaintlist = complaints.map(c => {
        const mdiv = c.affects[0]?.mdiv
        const movement = getters.getMovementById(mdiv)
        // console.log(mdiv, movement)
        return { ...c, movement }
      }).sort(getters[complaintsNames.getters.complaintSorter])
      // console.log(complaintlist)
      return state.sortReverse ? complaintlist.reverse() : complaintlist
    },
    [complaintsNames.getters.workComplaints]: (state, getters) => (workId) => {
      // TODO atId in loadComplaints?
      return getters.complaints.filter(c => tb.atId(c.movement?.work) === workId)
    },
    [complaintsNames.getters.displayComplaint]: (state) => state.displayComplaint,
    [complaintsNames.getters.activeComplaintId]: (state) => state.activeComplaintId,
    [complaintsNames.getters.activeComplaint] (state, getters) {
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
    [complaintsNames.getters.previousComplaintId] (state, getters) {
      const acid = state[complaintsNames.state.activeComplaintId]
      if (acid) {
        const complaintIds = getters[complaintsNames.getters.complaints].map((c) => c['@id'])
        const ncid = tb.findPrevious(complaintIds, (cid) => cid === acid)
        console.log(acid, ncid, complaintIds)
        return ncid
      }
      return undefined
    },
    [complaintsNames.getters.nextComplaintId] (state, getters) {
      const acid = state[complaintsNames.state.activeComplaintId]
      const complaintIds = getters[complaintsNames.getters.complaints].map((c) => c['@id'])
      console.log(acid, complaintIds)
      if (acid) {
        const ncid = tb.findPrevious(complaintIds, (cid) => cid === acid)
        console.log(acid, ncid, complaintIds)
        return ncid
      }
      return complaintIds.length > 0 ? complaintIds[0] : undefined
    },
    [complaintsNames.getters.filteredBy]: (state) => state[complaintsNames.state.filteredBy],
    [complaintsNames.getters.complaintFilter]: (state) => state[complaintsNames.state.complaintFilter],
    [complaintsNames.getters.sortedBy]: (state) => state[complaintsNames.state.sortedBy],
    [complaintsNames.getters.sortReverse]: (state) => state[complaintsNames.state.sortReverse] ? -1 : 1,
    [complaintsNames.getters.complaintSorter] (state, getters) {
      const complaintSorter = state[complaintsNames.state.complaintSorter]
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

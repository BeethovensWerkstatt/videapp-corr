import axios from 'axios'
import { startProc, finishProc } from '..'
import { mutations as mut, registerMutations, registerActions } from '../names'
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
    showComplaintsList: false,
    complaints: [],
    activeComplaintId: null
  },
  /**
   * @namespace store.complaints.mutations
   */
  mutations: {
    COMPLAINTS_LIST (state, show) {
      state.showComplaintsList = show
    },
    /**
     * load complaint
     * @memberof store.complaints.mutations
     * @param {Object} state
     * @param {Object} complaint
     */
    LOAD_COMPLAINT (state, complaint) {
      const complaints = [...state.complaints]
      complaints.push(complaint)
      state.complaints = complaints
      // console.log(complaint)
    },
    /**
     * replace complaint
     * @memberof store.complaints.mutations
     * @param {Object} state
     * @param {Object} complaint
     */
    MODIFY_COMPLAINT (state, complaint) {
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
    loadComplaints ({ commit, getters }, { complaints }) {
      complaints.forEach(c => {
        // console.log(c)
        const mdiv = c.affects[0]?.mdiv
        // console.log(state.movements, mdiv)
        const movement = mdiv ? getters.movements[mdiv] : undefined
        // TODO this looks like a workaround
        const complaint = movement ? { ...c, movement } : { ...c }
        // console.log(new Complaint(complaint))
        commit(mut.LOAD_COMPLAINT, complaint)
      })
    },
    /**
     * load complaints
     * @memberof store.complaints.actions
     * @param {String} complaintId id of complaint to activate
     */
    async activateComplaint ({ commit, state }, complaintId) {
      console.log('activate ' + complaintId)
      if (!complaintId) {
        state.activeComplaintId = null
        return
      }
      var complaint = state.complaints.find(c => c['@id'] === complaintId)
      if (!complaint) {
        console.error('complaint not found!', complaintId)
        return
      }
      state.activeComplaintId = complaintId
      if (!complaint.revisionDocs) {
        startProc()
        complaint.loading = true
        // console.log(complaint)
        try {
          const { data } = await axios.get(complaintId)
          complaint = { ...data, ...complaint }
          complaint.loading = false
          // console.log(complaint)
          commit(mut.MODIFY_COMPLAINT, complaint)
        } finally {
          finishProc()
        }
      }
    }
  },
  /**
   * @namespace store.complaints.getters
   * @property {Object[]} complaints array of complaints
   * @property {String} activeComplaintId id of displayed complaint
   * @property {Object} activeComplaint displayed complaint
   */
  getters: {
    showComplaintsList: (state) => state.showComplaintsList,
    complaints: (state, getters) => {
      return state.complaints.map(c => {
        const mdiv = c.affects[0]?.mdiv
        return {
          ...c,
          movement: getters.getMovementById(mdiv)
        }
      })
    },
    workComplaints: (state, getters) => (workId) => {
      // TODO atId in loadComplaints?
      return getters.complaints.filter(c => tb.atId(c.movement?.work) === workId)
    },
    activeComplaintId (state) {
      return state.activeComplaintId
    },
    activeComplaint (state, getters) {
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
    }
  }
}

registerMutations(complaintsModule.mutations)
registerActions(complaintsModule.actions)

export default complaintsModule

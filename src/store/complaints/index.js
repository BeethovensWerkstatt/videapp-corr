import axios from 'axios'
import { startProc, finishProc } from '..'
import { mutations as mut, actions as act } from '../names'
import tb from '@/toolbox'
// import Complaint from '@/data/Complaint'

export const complaintsNames = {
  state: {
    showComplaintsList: 'showComplaintsList',
    complaints: 'complaints',
    activeComplaintId: 'activeComplaintId',
    displayComplaint: 'displayComplaint'
  },
  mutations: {
    COMPLAINTS_LIST: 'COMPLAINTS_LIST',
    LOAD_COMPLAINT: 'LOAD_COMPLAINT',
    MODIFY_COMPLAINT: 'MODIFY_COMPLAINT',
    ACTIVATE_COMPLAINT: 'ACTIVATE_COMPLAINT',
    DISPLAY_COMPLAINT: 'DISPLAY_COMPLAINT'
  },
  actions: {
    loadComplaints: 'loadComplaints',
    loadComplaint: 'loadComplaint',
    activateComplaint: 'activateComplaint',
    openComplaintComparison: 'openComplaintComparison'
  },
  getters: {
    showComplaintsList: 'showComplaintsList',
    complaints: 'complaints',
    workComplaints: 'workComplaints',
    displayComplaint: 'displayComplaint',
    activeComplaintId: 'activeComplaintId',
    activeComplaint: 'activeComplaint'
  }
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
    [complaintsNames.state.showComplaintsList]: false,
    [complaintsNames.state.complaints]: [],
    [complaintsNames.state.activeComplaintId]: null,
    [complaintsNames.state.displayComplaint]: false
  },
  /**
   * @namespace store.complaints.mutations
   */
  mutations: {
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
      // console.log(complaint)
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
    [complaintsNames.mutations.ACTIVATE_COMPLAINT] (state, complaintId) {
      state.activeComplaintId = complaintId
    },
    [complaintsNames.mutations.DISPLAY_COMPLAINT] (state, display) {
      state.displayComplaint = display
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
      console.log('activate ' + complaintId)
      if (!complaintId) {
        commit(complaintsNames.ACTIVATE_COMPLAINT)
        return
      }
      var complaint = state.complaints.find(c => c['@id'] === complaintId)
      if (!complaint) {
        console.error('complaint not found!', complaintId)
        return
      }
      const callback = (complaint) => commit(mut.ACTIVATE_COMPLAINT, complaint['@id'])
      dispatch(act.loadComplaint, { complaint, callback })
    },
    async [complaintsNames.actions.loadComplaint] ({ commit }, { complaint, callback }) {
      if (!complaint.revisionDocs && complaint['@id']) {
        startProc()
        complaint.loading = true
        // console.log(complaint)
        try {
          const { data } = await axios.get(complaint['@id'])
          complaint = { ...data, ...complaint }
          complaint.loading = false
          // console.log(complaint)
          commit(mut.MODIFY_COMPLAINT, complaint)
          if (typeof callback === 'function') {
            callback(complaint)
          }
        } finally {
          finishProc()
        }
      }
    },
    async [complaintsNames.actions.openComplaintComparison] ({ dispatch, commit, state }, complaintId) {
      const hasDetailsLoaded = !complaintId.endsWith('.json')

      if (state.activeComplaintId === null && !hasDetailsLoaded) {
        const complaint = state.complaints.find(c => c['@id'] === complaintId)

        const f = () => {
          commit(complaintsNames.mutations.ACTIVATE_COMPLAINT, complaintId)
          commit(complaintsNames.mutations.DISPLAY_COMPLAINT, true)
        }
        dispatch(complaintsNames.actions.loadComplaint, { complaint, callback: f })
      } else {
        commit(complaintsNames.mutations.DISPLAY_COMPLAINT, true)
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
    [complaintsNames.getters.showComplaintsList]: (state) => state.showComplaintsList,
    [complaintsNames.getters.complaints]: (state, getters) => {
      return state.complaints.map(c => {
        const mdiv = c.affects[0]?.mdiv
        return {
          ...c,
          movement: getters.getMovementById(mdiv)
        }
      })
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
    }
  }
}

export default complaintsModule

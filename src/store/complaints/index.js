import axios from 'axios'
import { startProc, finishProc } from '..'
import { mutations as mut, registerMutations, registerActions } from '../names'

const toStore = {
  state: {
    complaints: [],
    activeComplaintId: null
  },
  mutations: {
    /**
     * load complaint
     * @memberof store.mutations
     * @param {Object} state
     * @param {Object} complaint
     */
    LOAD_COMPLAINT (state, complaint) {
      const complaints = [...state.complaints]
      complaints.push(complaint)
      state.complaints = complaints
    },
    /**
     * replace complaint
     * @param {Object} state
     * @param {Object} complaint
     */
    MODIFY_COMPLAINT (state, complaint) {
      const complaints = state.complaints.map(c => c['@id'] === complaint['@id'] ? complaint : c)
      state.complaints = complaints
    }
  },
  actions: {
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
      if (!complaint.embodiments) {
        startProc()
        complaint.loading = true
        try {
          const { data } = await axios.get(complaintId)
          complaint = { ...complaint, ...data }
          commit(mut.MODIFY_COMPLAINT, complaint)
        } finally {
          finishProc()
        }
      }
    },
    /**
     * load complaints
     * @memberof store.actions
     */
    loadComplaints ({ commit }, { complaints, movements }) {
      complaints.forEach(c => {
        const movement = movements[c.mdiv]
        // this seems like a workaround
        const complaint = { ...c, movement }
        commit(mut.LOAD_COMPLAINT, complaint)
      })
    }
  },
  getters: {
    complaints: (state) => {
      return state.complaints
    },
    activeComplaintId (state) {
      return state.activeComplaintId
    },
    activeComplaint (state, getters) {
      const complaintId = getters.activeComplaintId
      // console.log(complaintId)
      if (complaintId) {
        const complaint = state.complaints.find(c => c['@id'] === complaintId)
        return complaint
      }
      return null
    }
  }
}

registerMutations(toStore.mutations)
registerActions(toStore.actions)

export default toStore

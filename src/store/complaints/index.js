import axios from 'axios'
import { startProc, finishProc } from '..'
import { mutations as mut, registerMutations, registerActions } from '../names'
// import Complaint from '@/data/Complaint'

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
      // console.log(complaint)
      complaints.push(complaint)
      state.complaints = complaints
      // console.log(complaint)
    },
    /**
     * replace complaint
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
  actions: {
    /**
     * load complaints
     * @memberof store.actions
     */
    loadComplaints ({ state, commit }, { complaints }) {
      complaints.forEach(c => {
        const mdiv = c.affects[0]?.mdiv
        // console.log(state.movements, mdiv)
        const movement = mdiv ? state.movements[mdiv] : undefined
        // this seems like a workaround
        const complaint = movement ? { ...c, movement } : { ...c }
        // console.log(new Complaint(complaint))
        commit(mut.LOAD_COMPLAINT, complaint)
      })
    },
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
          console.log(complaint)
          commit(mut.MODIFY_COMPLAINT, complaint)
        } finally {
          finishProc()
        }
      }
    }
  },
  getters: {
    complaints: (state, getters) => {
      return state.complaints.map(c => {
        const mdiv = c.affects[0]?.mdiv
        return {
          ...c,
          movement: getters.getMovementById(mdiv)
        }
      })
    },
    activeComplaintId (state) {
      return state.activeComplaintId
    },
    activeComplaint (state, getters) {
      const complaintId = getters.activeComplaintId
      // console.log(complaintId)
      if (complaintId) {
        const complaint = state.complaints.find(c => c['@id'] === complaintId)
        console.log(complaint)
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

registerMutations(toStore.mutations)
registerActions(toStore.actions)

export default toStore

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
     * activate complaint (opens popup)
     * @memberof store.mutations
     * @param {Object} state
     * @param {String} id
     */
    ACTIVATE_COMPLAINT (state, id) {
      // console.log(mut.ACTIVATE_COMPLAINT, id)
      state.activeComplaintId = id
    }
  },
  actions: {
    /**
     * load complaints
     * @memberof store.actions
     */
    loadComplaints ({ commit }, { complaints }) {
      complaints.forEach(complaint => commit(mut.LOAD_COMPLAINT, complaint))
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

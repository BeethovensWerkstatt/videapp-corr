import axios from 'axios'
import { startProc, finishProc } from '..'
import n from '@/store/names'
import tb from '@/toolbox'

/**
 * @namespace store.complaints.actions
 */
const actions = {
  /**
   * load complaints
   * @memberof store.complaints.actions
   * @param {Object} payload object containing complaints property `{ complaints: Object[] }`
   */
  [n.actions.loadComplaints] ({ commit, /* dispatch, */ getters }, { complaints, work }) {
    console.log(getters[n.getters.directory_is_dev_work](tb.atId(work)), work)
    if (getters[n.getters.mainbranch] === getters[n.getters.version].branch && getters[n.getters.directory_is_dev_work](tb.atId(work))) return
    complaints.forEach(c => {
      // console.log(c, work)
      const mdiv = c.affects[0]?.mdiv
      // console.log(state.movements, mdiv)
      const movement = mdiv ? getters.movements[tb.atId(mdiv)] : undefined
      const workobj = getters[n.getters.getWork](work)
      const videapp = workobj?.level === 'videapp'
      // TODO this looks like a workaround
      const complaint = movement ? { videapp, work, ...c, movement } : { videapp, work, ...c }
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
    // console.log(complaintId, state.activeComplaintId)
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
  },
  [n.actions.setFilterSelect] ({ commit }, { tag, keys }) {
    console.log(tag, keys)
    for (const key in keys) {
      commit(n.mutations.SET_FILTER_SELECT, { tag, key, val: keys[key] })
    }
  }
}

export default actions

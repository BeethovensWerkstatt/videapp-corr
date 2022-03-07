import n from '@/store/names'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

// import Complaint from '@/data/Complaint'

// TODO filter & sort complaint list in extra state property

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
    [n.state.complaintFilterDialog]: {},
    [n.state.complaintFilter]: {},
    [n.state.sortedBy]: null,
    [n.state.sortReverse]: false,
    [n.state.complaintSorter]: null,
    [n.state.filterSelect]: {}
  },
  mutations,
  actions,
  getters
}

export default complaintsModule

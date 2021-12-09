export const complaintsNames = {
  state: {
    showComplaintsList: 'showComplaintsList',
    complaints: 'complaints',
    activeComplaintId: 'activeComplaintId',
    displayComplaint: 'displayComplaint',
    complaintFilter: 'complaintFilter',
    complaintSorter: 'complaintSorter'
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

export default complaintsNames

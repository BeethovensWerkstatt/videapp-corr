export const complaintsNames = {
  state: {
    showComplaintsList: 'showComplaintsList',
    complaints: 'complaints',
    activeComplaintId: 'activeComplaintId',
    displayComplaint: 'displayComplaint',
    filteredBy: 'filteredBy',
    complaintFilter: 'complaintFilter',
    sortedBy: 'sortedBy',
    sortReverse: 'sortReverse',
    complaintSorter: 'complaintSorter'
  },
  mutations: {
    COMPLAINTS_LIST: 'COMPLAINTS_LIST',
    LOAD_COMPLAINT: 'LOAD_COMPLAINT',
    MODIFY_COMPLAINT: 'MODIFY_COMPLAINT',
    ACTIVATE_COMPLAINT: 'ACTIVATE_COMPLAINT',
    DISPLAY_COMPLAINT: 'DISPLAY_COMPLAINT',
    SET_FILTER: 'SET_FILTER',
    SET_SORTER: 'SET_SORTER'
  },
  actions: {
    loadComplaints: 'loadComplaints',
    loadComplaint: 'loadComplaint',
    activateComplaint: 'activateComplaint',
    activateSibling: 'activateSibling',
    openComplaintComparison: 'openComplaintComparison'
  },
  getters: {
    showComplaintsList: 'showComplaintsList',
    complaints: 'complaints',
    workComplaints: 'workComplaints',
    displayComplaint: 'displayComplaint',
    activeComplaintId: 'activeComplaintId',
    activeComplaint: 'activeComplaint',
    previousComplaintId: 'previousComplaintId',
    nextComplaintId: 'nextComplaintId',
    filteredBy: 'filteredBy',
    complaintFilter: 'complaintFilter',
    sortedBy: 'sortedBy',
    complaintSorter: 'complaintSorter'
  }
}

export default complaintsNames

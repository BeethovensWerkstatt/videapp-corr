export const complaintsNames = {
  state: {
    showComplaintsList: 'showComplaintsList',
    complaints: 'complaints',
    activeComplaintId: 'activeComplaintId',
    displayComplaint: 'displayComplaint',
    complaintFilterDialog: 'complaintFilterDialog',
    complaintFilter: 'complaintFilter',
    filterSelect: 'filterSelect',
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
    DISPLAY_FILTER_DIALOG: 'DISPLAY_FILTER_DIALOG',
    SET_FILTER_SELECT: 'SET_FILTER_SELECT',
    SET_FILTER: 'SET_FILTER',
    REM_FILTER: 'REM_FILTER',
    SET_SORTER: 'SET_SORTER'
  },
  actions: {
    loadComplaints: 'loadComplaints',
    loadComplaint: 'loadComplaint',
    activateComplaint: 'activateComplaint',
    activateSibling: 'activateSibling',
    openComplaintComparison: 'openComplaintComparison',
    setFilterSelect: 'setFilterSelect'
  },
  getters: {
    showComplaintsList: 'showComplaintsList',
    complaints: 'complaints',
    allComplaints: 'allComplaints',
    workComplaints: 'workComplaints',
    displayComplaint: 'displayComplaint',
    activeComplaintId: 'activeComplaintId',
    activeComplaint: 'activeComplaint',
    previousComplaintId: 'previousComplaintId',
    nextComplaintId: 'nextComplaintId',
    filterSelection: 'filterSelection',
    filterSelect: 'filterSelect',
    complaintFilterDialog: 'complaintFilterDialog',
    complaintFilter: 'complaintFilter',
    sortedBy: 'sortedBy',
    complaintSorter: 'complaintSorter',
    complaintWorks: 'complaintWorks',
    complaintMovements: 'complaintMovements',
    complaintDocuments: 'complaintDocuments'
  }
}

export default complaintsNames

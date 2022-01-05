export const sortTag = {
  movementMeasure: 'movementMeasure',
  revisionObject: 'objects',
  textOperation: 'operation',
  classification: 'classes',
  context: 'context',
  implementation: 'implementation',
  document: 'document'
}
export const tagLabel = {
  [sortTag.movementMeasure]: 'terms.movement',
  [sortTag.revisionObject]: 'terms.complaint.revision-object',
  [sortTag.textOperation]: 'terms.complaint.text-operation',
  [sortTag.classification]: 'terms.complaint.classification',
  [sortTag.context]: 'terms.complaint.context',
  [sortTag.implementation]: 'terms.complaint.implementation',
  [sortTag.document]: 'terms.document'
}

export const complaintsNames = {
  state: {
    showComplaintsList: 'showComplaintsList',
    complaints: 'complaints',
    activeComplaintId: 'activeComplaintId',
    displayComplaint: 'displayComplaint',
    complaintFilter: 'complaintFilter',
    sortedBy: 'sortedBy',
    sortReverse: 'sortReverse',
    complaintSorter: 'complaintSorter',
    filterSelect: 'filterSelect'
  },
  mutations: {
    COMPLAINTS_LIST: 'COMPLAINTS_LIST',
    LOAD_COMPLAINT: 'LOAD_COMPLAINT',
    MODIFY_COMPLAINT: 'MODIFY_COMPLAINT',
    ACTIVATE_COMPLAINT: 'ACTIVATE_COMPLAINT',
    DISPLAY_COMPLAINT: 'DISPLAY_COMPLAINT',
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
    filterSelect: 'filterSelect',
    complaintFilter: 'complaintFilter',
    sortedBy: 'sortedBy',
    complaintSorter: 'complaintSorter'
  }
}

export default complaintsNames
